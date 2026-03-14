import logo from './logo.png'
import { useState } from 'react';
import MessageList from './ListeMessages.jsx';
import FormulaireSaisieMessage from './FormulaireSaisieMessage.jsx';

function ForumPage({setPage}) {
  const [messages, setMessages] = useState([   //etat contenant tous les messages du forum
    {
      auteur: 'Utilisateur 1',
      date: '25/02/2026 10:00',
      contenu: 'helloo !',
      reponses: [
        { auteur: 'Utilisateur 2', date: '25/02/2026 10:05', contenu: 'hii !', reponses: [] }
      ]
    },
    {
      auteur: 'Utilisateur 3',
      date: '25/02/2026 11:00',
      contenu: 'heyyy how are you ?',
      reponses: []
    }
  ]);

  const handleAddMessage = (msg) => { //fonction passée au formulaire pour ajouter un nouv msg
    setMessages([msg, ...messages]); //ajoute le nouv msg en début de liste
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
          <FormulaireSaisieMessage addMsg={handleAddMessage} /> {/**fournit au formulaire la fonction pour ajouter un message au parent(forumpage)*/}
        </section>

        <section id="listsmsgs"> 
          <MessageList messages={messages} />   {/**liste des messages existants */}
        </section>
      </main>
    </div>
  );
}

export default ForumPage;
