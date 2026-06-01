import Message from './Message.jsx';

// Affiche la liste des messages du forum.
// Chaque Message est lui-même récursif : il peut afficher ses propres réponses imbriquées.
// Les callbacks onDelete, onReply, onLike et onViewProfile sont passés jusqu'aux feuilles de l'arbre.
function MessageList({ messages, user, onReply, onDelete, onLike, onViewProfile }) {
  if (messages.length === 0) {
    return <p className="empty-state">Aucun message pour le moment.</p>;
  }

  return (
    <ul>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          {...msg}           // Passe toutes les propriétés du message (id, auteur, contenu, reponses, likes…)
          user={user}
          onReply={onReply}
          onDelete={onDelete}
          onLike={onLike}
          onViewProfile={onViewProfile}
        />
      ))}
    </ul>
  );
}

export default MessageList;
