import logo from './logo.png'
import { useState } from 'react';
import MessageList from './ListeMessages.jsx';
import FormulaireSaisieMessage from './FormulaireSaisieMessage.jsx';

function ForumPage({user, setPage}) {
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
    <div>
      <header>
        <h1>Forum</h1>
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


      <aside>
        <section id="zoneinfos">
          <p>Zone informations</p>
        </section>
      </aside>

  
      <main>
        <section id="zonenouvmsg">
          <FormulaireSaisieMessage addMsg={handleAddMessage} user={user}/> {/**fournit au formulaire la fonction pour ajouter un message au parent(forumpage)*/}
        </section>

        <section id="listsmsgs"> 
          <MessageList messages={messages} onDelete={handleDeleteMessage} user={user} onReply={handleReply}/>   {/**liste des messages existants */}
        </section>
      </main>
    </div>
  );
}

export default ForumPage;
