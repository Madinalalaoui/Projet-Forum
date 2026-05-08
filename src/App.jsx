import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const [messages, setMessages] = useState([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/forum");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetch(`${API_URL}/messages`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          hasFetched.current = true;
          setMessages(data.messages || []);
        }
      })
      .catch(err => console.error("Impossible de charger les messages:", err));
  }, []);

  useEffect(() => {
    if (!hasFetched.current) return;
    fetch(`${API_URL}/messages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    }).catch(err => console.error("Impossible de sauvegarder les messages:", err));
  }, [messages]);

  return (
    <div>
      <NavigationPanel user={user} isConnected={!!user} logout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/forum" replace />} />
        <Route path="/forum" element={
          <ForumPage
            user={user}
            forums={FORUMS}
            messages={messages}
            setMessages={setMessages}
          />
        } />
        <Route path="/login" element={<LoginPage login={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profil/:username" element={
          <ProfilPage user={user} messages={messages} setMessages={setMessages} />
        } />
        <Route path="/admin" element={
          user?.role === "admin"
            ? <AdminDashboard user={user} />
            : <Navigate to="/forum" replace />
        } />
      </Routes>
    </div>
  );
}

export default App;
