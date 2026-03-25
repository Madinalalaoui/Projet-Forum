import Message from './Message.jsx';

function MessageList({ messages, user, onReply, onDelete }) {
  return (
    <ul>
      {messages.map((msg, index) => (
        <Message
          key={index}
          auteur={msg.auteur}     
          date={msg.date}         
          contenu={msg.contenu}    
          reponses={msg.reponses}  
          id={msg.id}              
          user={user}
          onReply={onReply}
          onDelete={onDelete}      
        />
      ))}
    </ul>
  );
}

export default MessageList;