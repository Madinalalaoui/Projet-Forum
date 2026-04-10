import { Globe, Lock, MessagesSquare } from 'lucide-react';

function ForumType({ forums, user, setCurrentForum, currentForum }) {
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
          className={forum.id === currentForum?.id ? "forum-btn active" : "forum-btn"}
          onClick={() => setCurrentForum(forum)}
        >
          {forum.private ? <Lock size={13} /> : <Globe size={13} />}
          {forum.title}
        </button>
      ))}
    </div>
  );
}

export default ForumType;
