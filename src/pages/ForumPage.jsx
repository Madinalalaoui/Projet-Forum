import { useState } from 'react';
import { Search, Globe, Lock } from 'lucide-react';
import MessageList from '../components/forum/MessageList.jsx';
import MessageForm from '../components/forum/MessageForm.jsx';
import ForumType from '../components/forum/ForumType.jsx';
import '../assets/styles/ForumPage.css';

// --- Fonctions utilitaires pures ---

function deleteRecursive(messages, id) {
  return messages
    .filter(msg => msg.id !== id)
    .map(msg => ({ ...msg, reponses: deleteRecursive(msg.reponses || [], id) }));
}

function addReplyRecursive(messages, idMessage, reponse) {
  return messages.map(msg => {
    if (msg.id === idMessage) {
      return { ...msg, reponses: [...(msg.reponses || []), reponse] };
    }
    return { ...msg, reponses: addReplyRecursive(msg.reponses || [], idMessage, reponse) };
  });
}

function parseMessageDate(msg) {
  if (msg.createdAt) {
    const created = new Date(msg.createdAt);
    if (!Number.isNaN(created.getTime())) return created;
  }
  const nativeParsed = new Date(msg.date);
  if (!Number.isNaN(nativeParsed.getTime())) return nativeParsed;
  const frMatch = String(msg.date || '').match(
    /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+|,\s*)(\d{1,2}):(\d{2})(?::(\d{2}))?/
  );
  if (!frMatch) return null;
  const [, d, m, y, hh, mm, ss] = frMatch;
  return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss || 0));
}

// -------------------------------------------------------

function ForumPage({ user, forums, setPage, messages, setMessages, navigateToProfile }) {
  const [currentForum, setCurrentForum] = useState(forums[0]);
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isAdmin = user?.role === "admin";
  const canAccessPrivate = !currentForum.private || isAdmin;

  const handleAddMessage = (msg) => {
    setMessages(prev => [{ ...msg, forumId: currentForum.id }, ...prev]);
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => deleteRecursive(prev, id));
  };

  const handleReply = (idMessage, reponse) => {
    setMessages(prev => addReplyRecursive(prev, idMessage, reponse));
  };

  const messageMatchesFilters = (msg) => {
    const q = query.trim().toLowerCase();
    const textOk = !q
      || String(msg.contenu || '').toLowerCase().includes(q)
      || String(msg.auteur || '').toLowerCase().includes(q);
    const startBound = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const endBound = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
    const messageDate = parseMessageDate(msg);
    if (!startBound && !endBound) return textOk;
    if (!messageDate) return false;
    return textOk && (!startBound || messageDate >= startBound) && (!endBound || messageDate <= endBound);
  };

  const filterMessagesRecursive = (list) => list.reduce((acc, msg) => {
    const filteredReplies = filterMessagesRecursive(msg.reponses || []);
    if (messageMatchesFilters(msg) || filteredReplies.length > 0) {
      acc.push({ ...msg, reponses: filteredReplies });
    }
    return acc;
  }, []);

  const messagesForCurrentForum = messages.filter(msg => (msg.forumId ?? 1) === currentForum.id);
  const filteredMessages = filterMessagesRecursive(messagesForCurrentForum);
  const hasActiveFilters = query.trim() || startDate || endDate;

  return (
    <div className="forum-layout">

      {/* ---- Sidebar navigation ---- */}
      <aside className="left-sidebar">

        <section className="sidebar-section">
          <ForumType
            forums={forums}
            user={user}
            setCurrentForum={setCurrentForum}
            currentForum={currentForum}
          />
        </section>


        <section className="sidebar-section">
          <p className="section-label">
            <Search size={13} />
            Recherche
          </p>
          <div className="search-fields">
            <input
              placeholder="Mot-clé ou auteur…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div>
              <label htmlFor="startDate">Du</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate">Au</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-reset"
              onClick={() => { setQuery(''); setStartDate(''); setEndDate(''); }}
            >
              Effacer les filtres
            </button>
          )}
        </section>

      </aside>

      {/* ---- Colonne principale ---- */}
      <main className="messages-column">
        <div className="zone-messages">

          {/* En-tête : titre + compteur */}
          <div className="zone-header">
            <h1 className="zone-title">
              {currentForum.private ? <Lock size={15} /> : <Globe size={15} />}
              {currentForum.title}
            </h1>
            {canAccessPrivate && (
              <span className="message-count">
                {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}
                {hasActiveFilters && " trouvé(s)"}
              </span>
            )}
          </div>

          {/* Corps : messages ou accès refusé */}
          {!canAccessPrivate ? (
            <div className="access-denied">
              <Lock size={32} />
              <p>Ce forum est réservé aux administrateurs.</p>
            </div>
          ) : (
            <>
              <div className="messages-scroll">
                <MessageList
                  messages={filteredMessages}
                  onDelete={handleDeleteMessage}
                  user={user}
                  onReply={handleReply}
                  onViewProfile={navigateToProfile}
                />
              </div>

              {/* Zone de saisie — toujours en bas */}
              <div className="message-input-area">
                {user ? (
                  <MessageForm addMsg={handleAddMessage} user={user} />
                ) : (
                  <p className="login-hint">
                    <button className="link-btn" onClick={() => setPage("login_page")}>
                      Connectez-vous
                    </button>{" "}
                    pour poster un message.
                  </p>
                )}
              </div>
            </>
          )}

        </div>
      </main>

    </div>
  );
}

export default ForumPage;
