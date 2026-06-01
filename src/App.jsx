// Composant racine de l'application.
// Gère l'état global : utilisateur connecté et tableau des messages.
// Orchestre le routing React Router et la persistance via localStorage et l'API.
import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavigationPanel from './components/layout/NavigationPanel.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForumPage from './pages/ForumPage.jsx';
import ProfilPage from './pages/ProfilPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { API_URL } from './config.js';

// Définition des deux forums disponibles dans l'application.
// Le forum privé est réservé aux administrateurs (vérifié côté client dans ForumType et ForumPage).
const FORUMS = [
  { id: 1, title: "Forum Public", private: false },
  { id: 2, title: "Forum Privé", private: true },
];

function App() {
  // Restaure l'utilisateur depuis localStorage au rechargement de la page.
  // C'est ainsi que la session est maintenue côté client (stateless côté serveur).
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [messages, setMessages] = useState([]);

  // useRef pour savoir si c'est le premier rendu : évite de déclencher la sauvegarde
  // des messages au moment du chargement initial (avant qu'ils soient récupérés).
  const initialLoad = useRef(true);
  const navigate = useNavigate();

  // Connexion : stocke les données utilisateur dans localStorage et redirige vers le forum.
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/forum");
  };

  // Déconnexion : efface le localStorage et redirige vers la page de login.
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Chargement des messages depuis l'API au démarrage de l'application.
  useEffect(() => {
    fetch(`${API_URL}/messages`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setMessages(data.messages || []); })
      .catch(err => console.error("Impossible de charger les messages:", err));
  }, []);

  // Sauvegarde automatique des messages en base à chaque modification du tableau.
  // Le ref initialLoad empêche une sauvegarde parasite au premier rendu (avant le fetch).
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
      {/* Barre de navigation présente sur toutes les pages */}
      <NavigationPanel user={user} isConnected={!!user} logout={handleLogout} />
      <Routes>
        {/* Redirection de la racine vers le forum */}
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
        {/* Route admin protégée : redirige vers le forum si l'utilisateur n'est pas admin */}
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
