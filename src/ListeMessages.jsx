
import Message from './Message.jsx';

function MessageList({messages}) { /**affiche la liste de messages : un composant Message pour chacun des éléments du tableau 'messages'*/
  return (
    <ul>
      {messages.map((msg,index) => (
        <Message
          auteur={msg.auteur}
          date={msg.date}
          contenu={msg.contenu}
          reponses={msg.reponses}
        />
      ))}
    </ul>
  );
}

export default MessageList;