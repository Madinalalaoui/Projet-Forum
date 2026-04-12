import { useEffect, useRef, useState } from 'react';
import NavigationPanel from './components/layout/NavigationPanel.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForumPage from './pages/ForumPage.jsx';
import ProfilPage from './pages/ProfilPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { API_URL } from './config.js';

const FORUMS = [
  { id: 1, title: "Forum Public", private: false },
  { id: 2, title: "Forum Privé", private: true },
];

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState("forum_page");
  const [messages, setMessages] = useState([]);
  const initialLoad = useRef(true);
  const [viewedUsername, setViewedUsername] = useState(null);

  const navigateToProfile = (username) => {
    setViewedUsername(username);
    setPage("profil_page");
  };

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setPage("forum_page");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("login_page");
  };

  useEffect(() => {
    fetch(`${API_URL}/messages`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setMessages(data.messages || []); })
      .catch(err => console.error("Impossible de charger les messages:", err));
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    fetch(`${API_URL}/messages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    }).catch(err => console.error("Impossible de sauvegarder les messages:", err));
  }, [messages]);

  return (
    <div>
      <NavigationPanel
        user={user}
        isConnected={!!user}
        page={page}
        setPage={(p) => { setViewedUsername(null); setPage(p); }}
        logout={handleLogout}
      />

      {page === "login_page" && <LoginPage login={handleLogin} setPage={setPage} />}
      {page === "signup_page" && <SignupPage setPage={setPage} />}
      {page === "forum_page" && (
        <ForumPage
          user={user}
          setPage={setPage}
          forums={FORUMS}
          messages={messages}
          setMessages={setMessages}
          navigateToProfile={navigateToProfile}
        />
      )}
      {page === "profil_page" && (
        <ProfilPage
          user={user}
          messages={messages}
          setMessages={setMessages}
          viewedUsername={viewedUsername ?? user?.username}
        />
      )}
      {page === "admin_page" && user?.role === "admin" && (
        <AdminDashboard user={user} />
      )}
    </div>
  );
}

export default App;
