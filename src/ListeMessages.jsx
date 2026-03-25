import Message from './Message.jsx';

function MessageList({ messages, user, onReply }) {
  return (
    <ul>
      {messages.map((msg, index) => (
        <li key={index}>
          <Message {...msg} />

          {/* bouton réponse uniquement si connecté */}
          {user && (
            <button onClick={() => onReply(msg)}>
              +
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default MessageList;