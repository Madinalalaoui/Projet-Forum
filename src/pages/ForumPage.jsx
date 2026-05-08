import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleLikeRecursive } from '../utils/messages.js';
import { Search, Globe, Lock } from 'lucide-react';
import MessageList from '../components/forum/MessageList.jsx';
import MessageForm from '../components/forum/MessageForm.jsx';
import ForumType from '../components/forum/ForumType.jsx';
import { deleteRecursive, addReplyRecursive } from '../utils/messages.js';
import '../assets/styles/ForumPage.css';

function ForumPage({ user, forums, messages, setMessages }) {
  const [currentForum, setCurrentForum] = useState(forums[0]);
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const canAccessPrivate = !currentForum.private || user?.role === "admin";

  const handleAddMessage = (msg) => {
    setMessages(prev => [{ ...msg, forumId: currentForum.id }, ...prev]);
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => deleteRecursive(prev, id));
  };

  const handleReply = (idMessage, reponse) => {
    setMessages(prev => addReplyRecursive(prev, idMessage, reponse));
  };

const handleLike = (id, username) => {
  setMessages(prev => toggleLikeRecursive(prev, id, username));
};

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

  const filterMessagesRecursive = (list) => list.reduce((acc, msg) => {
    const filteredReplies = filterMessagesRecursive(msg.reponses || []);
    if (messageMatchesFilters(msg) || filteredReplies.length > 0) {
      acc.push({ ...msg, reponses: filteredReplies });
    }
    return acc;
  }, []);

  const messagesForCurrentForum = messages.filter(msg => (msg.forumId ?? 1) === currentForum.id);
  const filteredMessages = filterMessagesRecursive(messagesForCurrentForum);
  const hasActiveFilters = query.trim() || startDate || endDate;

  return (
    <div className="forum-layout">

      <aside className="left-sidebar">

        <section className="sidebar-section">
          <ForumType
            forums={forums}
            user={user}
            setCurrentForum={setCurrentForum}
            currentForum={currentForum}
          />
        </section>

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
              <span className="message-count">{filteredMessages.length}</span>
            )}
          </div>

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
                  onViewProfile={(username) => navigate(`/profil/${username}`)}
                />
              </div>

              <div className="message-input-area">
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
