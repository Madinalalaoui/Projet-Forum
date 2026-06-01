import { useState } from 'react';
import { Trash2, CornerDownRight, X, Send } from 'lucide-react';
import { createMessage, formatDate } from '../../utils/messages.js';

// Composant récursif représentant un message et ses réponses imbriquées.
// Props reçues : données du message + callbacks pour les actions (supprimer, répondre, liker, voir profil).
function Message({ auteur, createdAt, contenu, reponses, id, likes, onDelete, user, onReply, onLike, onViewProfile }) {
  // Contrôle l'affichage du formulaire de réponse inline
  const [showReply, setShowReply] = useState(false);
  const [texte, setTexte] = useState("");

  // Un utilisateur peut supprimer son propre message ou n'importe lequel s'il est admin
  const canDelete = user && (auteur === user.username || user.role === "admin");

  const handleReply = (e) => {
    e.preventDefault();
    if (!texte.trim()) return;
    // Crée un nouveau message et le remonte via le callback onReply
    onReply(id, createMessage(user.username, texte));
    setTexte("");
    setShowReply(false);
  };

  const handleLike = () => {
    if (!user) return; // Seuls les utilisateurs connectés peuvent liker
    console.log("utilisateur a liké un message ❤️ :", user.username, "message :", id);
    onLike(id, user.username);
  };

  return (
    <li>
      <div className="msg-layout">
        {/* Avatar généré à partir de la première lettre du nom d'utilisateur */}
        <div className="msg-avatar" aria-hidden="true">
          {auteur.charAt(0).toUpperCase()}
        </div>

        <div className="msg-body">
          <p className="msg-meta">
            {/* Clic sur le nom de l'auteur navigue vers son profil */}
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
            <p className="message-content">{contenu}</p>

            <div className="msg-actions">
              {/* Bouton like : affiche le nombre de likes et permet le toggle */}
              <button className="btn-like" onClick={handleLike}>
                ❤️ {likes.length}
              </button>

              {/* Bouton suppression visible uniquement pour l'auteur ou un admin */}
              {canDelete && (
                <button className="btn-danger" onClick={() => {
                  console.log("utilisateur a supprimé un message 🗑️ :", {
                    id,
                    auteur,
                    contenu
                  });
                  onDelete(id);
                }}>
                  <Trash2 size={12} />
                  Supprimer
                </button>
              )}

              {/* Bouton répondre visible uniquement pour les utilisateurs connectés */}
              {user && (
                <button className="btn-reply" onClick={() => setShowReply(!showReply)}>
                  {showReply ? <X size={12} /> : <CornerDownRight size={12} />}
                  {showReply ? "Annuler" : "Répondre"}
                </button>
              )}
            </div>

            {/* Formulaire de réponse inline, affiché uniquement quand showReply est vrai */}
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

            {/* Rendu récursif des réponses : Message s'appelle lui-même pour chaque réponse */}
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
