import { Globe, Lock, MessagesSquare } from 'lucide-react';

// Affiche la liste des forums disponibles dans la barre latérale.
// Les forums privés ne sont visibles que par les administrateurs.
// Un clic sur un forum met à jour le forum actif dans ForumPage.
function ForumType({ forums, user, setCurrentForum, currentForum }) {
  // Filtre les forums : retire les forums privés si l'utilisateur n'est pas admin
  const visibleForums = forums.filter(f => !f.private || user?.role === "admin");

  return (
    <div>
      <p className="section-label">
        <MessagesSquare size={13} />
        Forums
      </p>
      {visibleForums.map(forum => (
        <button
          key={forum.id}
          // Applique la classe "active" sur le forum actuellement sélectionné
          className={forum.id === currentForum?.id ? "forum-btn active" : "forum-btn"}
          onClick={() => setCurrentForum(forum)}
        >
          {/* Icône cadenas pour les forums privés, globe pour les publics */}
          {forum.private ? <Lock size={13} /> : <Globe size={13} />}
          {forum.title}
        </button>
      ))}
    </div>
  );
}

export default ForumType;
