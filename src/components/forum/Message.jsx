import { useState } from 'react';
import { Trash2, CornerDownRight, X, Send } from 'lucide-react';
import { createMessage, formatDate } from '../../utils/messages.js';

function Message({ auteur, createdAt, contenu, reponses, id,likes, onDelete, user, onReply, onLike, onViewProfile }) {
  const [showReply, setShowReply] = useState(false);
  const [texte, setTexte] = useState("");

  const canDelete = user && (auteur === user.username || user.role === "admin");

  const handleReply = (e) => {
    e.preventDefault();
    if (!texte.trim()) return;
    onReply(id, createMessage(user.username, texte));
    setTexte(""); 
    setShowReply(false);
  };

const handleLike = () => {
  if (!user) return;
  onLike(id, user.username);
};

  return (
    <li>
      <div className="msg-layout">
        <div className="msg-avatar" aria-hidden="true">
          {auteur.charAt(0).toUpperCase()}
        </div>

        <div className="msg-body">
          <p className="msg-meta">
            <span
              className="msg-author"
              onClick={() => onViewProfile?.(auteur)}
              style={{ cursor: onViewProfile ? "pointer" : "default" }}
            >
              {auteur}
            </span>
            <span className="msg-separator">·</span>
            <time className="msg-date">{formatDate(createdAt)}</time>
          </p>

          <blockquote>
            {auteur === "Captain Hook" ? (
              <div className="message-content" style={{whiteSpace: "pre-wrap"}}>
                <strong>{contenu.split('\n')[0]}</strong>
                <span>{contenu.split('\n').slice(1).join('\n')}</span>
              </div>
            ) : (<p className="message-content" style={{whiteSpace: "pre-wrap"}}>{contenu}</p>)}

            <div className="msg-actions">
              <button className="btn-like" onClick={handleLike}>
                ❤️ {likes.length}
              </button>

              {canDelete && (
                <button className="btn-danger" onClick={() => onDelete(id)}>
                  <Trash2 size={12} />
                  Supprimer
                </button>
              )}
              {user && (
                <button className="btn-reply" onClick={() => setShowReply(!showReply)}>
                  {showReply ? <X size={12} /> : <CornerDownRight size={12} />}
                  {showReply ? "Annuler" : "Répondre"}
                </button>
              )}
            </div>

            {showReply && (
              <form className="reply-form" onSubmit={handleReply}>
                <textarea
                  placeholder="Écrire une réponse..."
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                  <Send size={13} />
                  Envoyer
                </button>
              </form>
            )}

            {reponses?.length > 0 && (
              <ul>
                {reponses.map((rep) => (
                  <Message
                    key={rep.id}
                    {...rep}
                    onDelete={onDelete}
                    user={user}
                    onReply={onReply}
                    onLike={onLike}
                    onViewProfile={onViewProfile}
                  />
                ))}
              </ul>
            )}
          </blockquote>
        </div>
      </div>
    </li>
  );
}

export default Message;
