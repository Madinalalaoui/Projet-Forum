import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import profilImg from '../assets/images/profil.png';
import UserCard from '../components/user/UserCard.jsx';
import '../assets/styles/Profil.css';

function getUserMessages(allMessages, username) {
  const result = [];
  const visit = (list) => {
    list.forEach((msg) => {
      if (msg.auteur === username) result.push(msg);
      if (msg.reponses?.length > 0) visit(msg.reponses);
    });
  };
  visit(allMessages);
  return result;
}

function removeMessageById(list, id) {
  return list
    .filter(msg => msg.id !== id)
    .map(msg => ({ ...msg, reponses: removeMessageById(msg.reponses || [], id) }));
}

function ProfilPage({ user, messages = [], setMessages, viewedUsername }) {
  const [viewedUser, setViewedUser] = useState(null);

  const isOwnProfile = viewedUsername === user?.username;

  useEffect(() => {
    if (!viewedUsername) return;

    if (isOwnProfile) {
      setViewedUser({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        photo: profilImg,
      });
      return;
    }

    fetch(`http://localhost:3001/users/${viewedUsername}`)
      .then(res => {
        if (!res.ok) throw new Error("Utilisateur non trouvé");
        return res.json();
      })
      .then(data => setViewedUser({ ...data, photo: profilImg }))
      .catch(() => setViewedUser(null));
  }, [viewedUsername]);

  if (!user) {
    return (
      <div className="profil-page">
        <p className="empty-state">Connectez-vous pour voir votre profil.</p>
      </div>
    );
  }

  if (!viewedUser) {
    return (
      <div className="profil-page">
        <p className="empty-state">Chargement...</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    setMessages(prev => removeMessageById(prev, id));
  };

  const userMessages = getUserMessages(messages, viewedUser.username);

  return (
    <div className="profil-page">
      <div className="profil-layout">

        <aside className="profil-sidebar">
          <UserCard user={viewedUser} />
        </aside>

        <main className="profil-main">
          <h3 className="profil-title">
            {isOwnProfile ? "Mes messages" : `Messages de ${viewedUser.username}`}
            <span className="profil-count">{userMessages.length}</span>
          </h3>

          {userMessages.length === 0 ? (
            <p className="empty-state">Aucun message publié pour le moment.</p>
          ) : (
            <ul className="profil-messages-list">
              {userMessages.map((msg) => (
                <li key={msg.id} className="profil-message-item">
                  <div className="profil-msg-header">
                    <time className="profil-msg-date">{msg.date}</time>
                    {isOwnProfile && (
                      <button className="btn-danger" onClick={() => handleDelete(msg.id)}>
                        <Trash2 size={12} />
                        Supprimer
                      </button>
                    )}
                  </div>
                  <p className="profil-msg-content">{msg.contenu}</p>
                </li>
              ))}
            </ul>
          )}
        </main>

      </div>
    </div>
  );
}

export default ProfilPage;
