import Message from './Message.jsx';

function MessageList({ messages, user, onReply, onDelete, onViewProfile }) {
  if (messages.length === 0) {
    return <p className="empty-state">Aucun message pour le moment.</p>;
  }

  return (
    <ul>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          {...msg}
          user={user}
          onReply={onReply}
          onDelete={onDelete}
          onViewProfile={onViewProfile}
        />
      ))}
    </ul>
  );
}

export default MessageList;
