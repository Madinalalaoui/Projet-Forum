import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';
import '../assets/styles/Login.css';

// Page de connexion.
// Envoie les identifiants au serveur via POST /login.
// En cas de succès, appelle le callback login (défini dans App) qui stocke l'utilisateur
// dans le localStorage et redirige vers /forum.
function LoginPage({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Affiche le message d'erreur renvoyé par le serveur (compte non trouvé, en attente, etc.)
        setError(data.message || "Utilisateur ou mot de passe incorrect");
        return;
      }
      // Transmet les données utilisateur au composant App pour stocker la session
      login(data);
      console.log("Utilisateur connecté :", data.username);
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="login-container">
      <h1>Ouvrir une session</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="login">Nom d'utilisateur</label>
          <input
            id="login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group password-group">
          <label htmlFor="password">Mot de passe</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Bascule entre affichage en clair et masqué */}
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Connexion</button>
        </div>

        <p className="form-switch">
          Pas encore de compte ?{" "}
          <button className="link-btn" onClick={() => navigate("/signup")}>
            Créer un compte
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
