import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import profilImg from '../assets/images/profil.png';
import UserCard from '../components/user/UserCard.jsx';
import { deleteRecursive, formatDate } from '../utils/messages.js';
import { API_URL } from '../config.js';
import '../assets/styles/Profil.css';

// Parcourt récursivement tout l'arbre de messages pour collecter ceux d'un utilisateur donné,
// y compris les réponses imbriquées à n'importe quelle profondeur.
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

// Page de profil d'un utilisateur, accessible via l'URL /profil/:username.
// Si c'est le profil de l'utilisateur connecté, les données viennent du state local (pas de fetch).
// Sinon, on interroge GET /users/:username pour récupérer les informations de l'utilisateur visité.
function ProfilPage({ user, messages = [], setMessages }) {
  const { username } = useParams(); // Récupère le username depuis l'URL
  const [viewedUser, setViewedUser] = useState(null);

  const isOwnProfile = username === user?.username;

  useEffect(() => {
    if (isOwnProfile) {
      // Pas de requête réseau si l'utilisateur consulte son propre profil
      setViewedUser({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        photo: profilImg,
      });
      return;
    }

    // Fetch le profil de l'utilisateur visité depuis l'API
    fetch(`${API_URL}/users/${username}`)
      .then(res => {
        if (!res.ok) throw new Error("Utilisateur non trouvé");
        return res.json();
      })
      .then(data => setViewedUser({ ...data, photo: profilImg }))
      .catch(() => setViewedUser(null));
  }, [username]); // Se redéclenche si le username dans l'URL change

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

  // Suppression d'un message : propagée au state global via setMessages dans App
  const handleDelete = (id) => {
    setMessages(prev => deleteRecursive(prev, id));
  };

  // Collecte tous les messages de l'utilisateur consulté (top-level + imbriqués)
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
                    <div className="profil-msg-meta-info">
                      <time className="profil-msg-date">{formatDate(msg.createdAt)}</time>
                      <span className="profil-msg-likes" style={{ marginLeft: '10px', color: '#e0245e' }}>
                        ❤️ {msg.likes?.length || 0}
                      </span>
                    </div>
                    {/* Bouton de suppression visible uniquement sur son propre profil */}
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
