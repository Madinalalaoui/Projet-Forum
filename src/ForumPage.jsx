import logo from './logo.png'
import { useState } from 'react';
import MessageList from './ListeMessages.jsx';
import FormulaireSaisieMessage from './FormulaireSaisieMessage.jsx';
import AdminPanel from "./AdminPanel";
import ForumType from './ForumType.jsx'; 
import './ForumPage.css';

function ForumPage({user, forums, setPage}) {

  const [currentForum, setCurrentForum] = useState(forums[0]);

  if (currentForum.private && !user) {
    return <p>Forum privé — connexion requise</p>;
  }

  const [messages, setMessages] = useState([   //etat contenant tous les messages du forum
    {
      id: 1,
      auteur: 'Utilisateur 1',
      date: '25/02/2026 10:00',
      contenu: 'helloo !',
      reponses: []
    },
    {
      id: 2,
      auteur: 'Utilisateur 2',
      date: '25/02/2026 11:00',
      contenu: 'im gonna go..',
      reponses: []
    }
  ]);

  const handleAddMessage = (msg) => { //fonction passée au formulaire pour ajouter un nouv msg
    setMessages(prev => [msg, ...prev]); //ajoute le nouv msg en début de liste
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

  return (
    <div className="page-entiere">
       
      <header>
       <h1>{currentForum.title} {currentForum.private && "🔒"}</h1>
        <section id="logo">
          <img src={logo} alt="Logo du site" height={150}/>
        </section>

        <section id="zonerecherche">
          <form>
            <label htmlFor="requete">Zone de recherche : </label>
            <input id="requete" /><br />
            <p>Date de début de Recherche : <input type="date" /></p>
            <p>Date de fin de Recherche : <input type="date" /></p>
            <input type="submit" id="search_button" />
          </form>
        </section>

 
        <section id="liens">
          <button onClick={() => setPage("login_page")}>Connexion</button>
          <button onClick={() => setPage("signin_page")}>Créer un compte</button>
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
          <MessageList
            messages={messages}
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
