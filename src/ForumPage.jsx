import logo from './assets/logo.png'
import { useState } from 'react';
import MessageList from './ListeMessages.jsx';
import FormulaireSaisieMessage from './FormulaireSaisieMessage.jsx';
import AdminPanel from "./AdminPanel";
import ForumType from './ForumType.jsx'; 
import './assets/ForumPage.css';

function ForumPage({user, forums, setPage, messages, setMessages}) {

  const [currentForum, setCurrentForum] = useState(forums[0]);
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const isAdmin = user?.role === "admin";
  const canAccessPrivate = !currentForum.private || isAdmin;
  
  if (!canAccessPrivate) {
    return <p>Ce forum est privé (accès admin uniquement).</p>;
  }

  const handleAddMessage = (msg) => { //fonction passée au formulaire pour ajouter un nouv msg
    setMessages(prev => [
      {
        ...msg,
        forumId: currentForum.id
      },
      ...prev
    ]); //ajoute le nouv msg en début de liste
  };

const deleteRecursive = (messages, id) => {
  return messages
    .filter(msg => msg.id !== id)
    .map(msg => ({
      ...msg,
      reponses: deleteRecursive(msg.reponses || [], id)
    }));
};

const handleDeleteMessage = (id) => {
  setMessages(prev => deleteRecursive(prev, id));
};

const addReplyRecursive = (messages, idMessage, reponse) => {
  return messages.map(msg => {
    if (msg.id === idMessage) {
      return {
        ...msg,
        reponses: [...(msg.reponses || []), reponse]
      };
    }

    return {
      ...msg,
      reponses: addReplyRecursive(msg.reponses || [], idMessage, reponse)
    };
  });
};

const handleReply = (idMessage, reponse) => { 
  setMessages(prev => addReplyRecursive(prev, idMessage, reponse));
};

const parseMessageDate = (msg) => {
  if (msg.createdAt) {
    const created = new Date(msg.createdAt);
    if (!Number.isNaN(created.getTime())) return created;
  }

  const nativeParsed = new Date(msg.date);
  if (!Number.isNaN(nativeParsed.getTime())) return nativeParsed;

  const frMatch = String(msg.date || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+|,\s*)(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!frMatch) return null;

  const [, d, m, y, hh, mm, ss] = frMatch;
  return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss || 0));
};

const messageMatchesFilters = (msg) => {
  const q = query.trim().toLowerCase();
  const textOk = !q || String(msg.contenu || '').toLowerCase().includes(q) || String(msg.auteur || '').toLowerCase().includes(q);

  const startBound = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const endBound = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
  const messageDate = parseMessageDate(msg);

  if (!startBound && !endBound) return textOk;
  if (!messageDate) return false;

  const afterStart = !startBound || messageDate >= startBound;
  const beforeEnd = !endBound || messageDate <= endBound;

  return textOk && afterStart && beforeEnd;
};

const filterMessagesRecursive = (list) => {
  return list.reduce((acc, msg) => {
    const filteredReplies = filterMessagesRecursive(msg.reponses || []);
    const selfMatch = messageMatchesFilters(msg);

    if (selfMatch || filteredReplies.length > 0) {
      acc.push({
        ...msg,
        reponses: filteredReplies
      });
    }

    return acc;
  }, []);
};

const messagesForCurrentForum = messages.filter(
  (msg) => (msg.forumId ?? 1) === currentForum.id
);

const filteredMessages = filterMessagesRecursive(messagesForCurrentForum);

const handleSearchSubmit = (e) => {
  e.preventDefault();
};

const handleResetFilters = () => {
  setQuery('');
  setStartDate('');
  setEndDate('');
};

  return (
    <div className="page-entiere">
       
      <header>
       <h1>{currentForum.title} {currentForum.private && "🔒"}</h1>
        <section id="logo">
          <img src={logo} alt="Logo du site" height={150}/>
        </section>

        <section id="zonerecherche">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="requete">Zone de recherche</label>
            <input
              id="requete"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            /><br />
            <p>
              Date de début de Recherche
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </p>
            <p>
              Date de fin de Recherche
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </p>
            <input type="submit" id="search_button" value="Rechercher" />
            <button type="button" onClick={handleResetFilters}>Réinitialiser</button>
          </form>
        </section>
      </header>

  
      <main>
        {/* Sélecteur de forums */}
        <ForumType
          forums={forums}
          user={user}
          setCurrentForum={setCurrentForum}
        />

        {/* Panneau admin */}
        {user?.role === "admin" && <AdminPanel user={user} />}

        <section id="zonenouvmsg">
          <FormulaireSaisieMessage addMsg={handleAddMessage} user={user}/>
        </section>

        <section id="listsmsgs">
          <p>{filteredMessages.length} message(s) trouvé(s)</p>
          <MessageList
            messages={filteredMessages}
            onDelete={handleDeleteMessage}
            user={user}
            onReply={handleReply}
          />
        </section>
      </main>
    </div>
  );
}

export default ForumPage;
