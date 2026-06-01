import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleLikeRecursive } from '../utils/messages.js';
import { Search, Globe, Lock } from 'lucide-react';
import MessageList from '../components/forum/MessageList.jsx';
import MessageForm from '../components/forum/MessageForm.jsx';
import ForumType from '../components/forum/ForumType.jsx';
import { deleteRecursive, addReplyRecursive } from '../utils/messages.js';
import '../assets/styles/ForumPage.css';

// Page principale du forum.
// Gère la sélection du forum actif, le filtrage des messages (mot-clé + plage de dates),
// et orchestre les actions utilisateur (poster, supprimer, répondre, liker).
// Les messages sont stockés dans App et passés ici via props pour être modifiés via setMessages.
function ForumPage({ user, forums, messages, setMessages }) {
  // Forum sélectionné par défaut : le premier de la liste (Forum Public)
  const [currentForum, setCurrentForum] = useState(forums[0]);
  const [query, setQuery] = useState('');       // Filtre texte (contenu ou auteur)
  const [startDate, setStartDate] = useState(''); // Borne inférieure de la plage de dates
  const [endDate, setEndDate] = useState('');     // Borne supérieure de la plage de dates
  const navigate = useNavigate();

  // Un utilisateur peut accéder au forum privé uniquement s'il est admin
  const canAccessPrivate = !currentForum.private || user?.role === "admin";

  // Ajoute le message en tête de liste avec l'id du forum courant
  const handleAddMessage = (msg) => {
    setMessages(prev => [{ ...msg, forumId: currentForum.id }, ...prev]);
  };

  // Supprime un message par son id (y compris dans les réponses imbriquées)
  const handleDeleteMessage = (id) => {
    setMessages(prev => deleteRecursive(prev, id));
  };

  // Ajoute une réponse à un message cible, à n'importe quelle profondeur
  const handleReply = (idMessage, reponse) => {
    setMessages(prev => addReplyRecursive(prev, idMessage, reponse));
  };

  // Toggle le like d'un utilisateur sur un message (ajoute ou retire)
  const handleLike = (id, username) => {
    setMessages(prev => toggleLikeRecursive(prev, id, username));
  };

  // Vérifie si un message correspond aux filtres actifs (texte et/ou dates).
  // La borne de fin est fixée à 23h59:59 pour inclure toute la journée sélectionnée.
  const messageMatchesFilters = (msg) => {
    const q = query.trim().toLowerCase();
    const textOk = !q
      || String(msg.contenu || '').toLowerCase().includes(q)
      || String(msg.auteur || '').toLowerCase().includes(q);
    const startBound = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const endBound = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
    const messageDate = msg.createdAt ? new Date(msg.createdAt) : null;
    if (!startBound && !endBound) return textOk;
    if (!messageDate) return false;
    return textOk && (!startBound || messageDate >= startBound) && (!endBound || messageDate <= endBound);
  };

  // Filtre récursivement : conserve un message s'il correspond OU si l'une de ses réponses correspond.
  // Cela évite de masquer un fil de discussion entier à cause d'un seul message hors filtre.
  const filterMessagesRecursive = (list) => list.reduce((acc, msg) => {
    const filteredReplies = filterMessagesRecursive(msg.reponses || []);
    if (messageMatchesFilters(msg) || filteredReplies.length > 0) {
      acc.push({ ...msg, reponses: filteredReplies });
    }
    return acc;
  }, []);

  // Isole les messages du forum courant (forumId absent = forum public par défaut)
  const messagesForCurrentForum = messages.filter(msg => (msg.forumId ?? 1) === currentForum.id);
  const filteredMessages = filterMessagesRecursive(messagesForCurrentForum);
  const hasActiveFilters = query.trim() || startDate || endDate;

  return (
    <div className="forum-layout">

      <aside className="left-sidebar">

        {/* Sélecteur de forum */}
        <section className="sidebar-section">
          <ForumType
            forums={forums}
            user={user}
            setCurrentForum={setCurrentForum}
            currentForum={currentForum}
          />
        </section>

        {/* Panneau de recherche avec filtres texte et dates */}
        <section className="sidebar-section">
          <p className="section-label">
            <Search size={13} />
            Recherche
          </p>
          <div className="search-fields">
            <input
              placeholder="Mot-clé ou auteur…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div>
              <label htmlFor="startDate">Du</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate">Au</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {/* Bouton de réinitialisation visible uniquement si un filtre est actif */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-reset"
              onClick={() => { setQuery(''); setStartDate(''); setEndDate(''); }}
            >
              Effacer les filtres
            </button>
          )}
        </section>

      </aside>

      <main className="messages-column">
        <div className="zone-messages">

          <div className="zone-header">
            <h1 className="zone-title">
              {currentForum.private ? <Lock size={15} /> : <Globe size={15} />}
              {currentForum.title}
            </h1>
            {canAccessPrivate && (
              <span className="message-count">
                {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}
                {hasActiveFilters && " trouvé(s)"}
              </span>
            )}
          </div>

          {/* Mur d'accès refusé pour les non-admins sur le forum privé */}
          {!canAccessPrivate ? (
            <div className="access-denied">
              <Lock size={32} />
              <p>Ce forum est réservé aux administrateurs.</p>
            </div>
          ) : (
            <>
              <div className="messages-scroll">
                <MessageList
                  messages={filteredMessages}
                  onDelete={handleDeleteMessage}
                  user={user}
                  onReply={handleReply}
                  onLike={handleLike}
                  // Navigation vers le profil d'un auteur via son username dans l'URL
                  onViewProfile={(username) => navigate(`/profil/${username}`)}
                />
              </div>

              <div className="message-input-area">
                {/* Formulaire affiché si connecté, sinon invitation à se connecter */}
                {user ? (
                  <MessageForm addMsg={handleAddMessage} user={user} />
                ) : (
                  <p className="login-hint">
                    <button className="link-btn" onClick={() => navigate("/login")}>
                      Connectez-vous
                    </button>{" "}
                    pour poster un message.
                  </p>
                )}
              </div>
            </>
          )}

        </div>
      </main>

    </div>
  );
}

export default ForumPage;
