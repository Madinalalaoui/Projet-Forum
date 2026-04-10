import { useState } from 'react';
import '../assets/styles/Login.css';

function LoginPage({ login, setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Utilisateur ou mot de passe incorrect");
        return;
      }
      login(data);
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
          <button className="link-btn" onClick={() => setPage("signup_page")}>
            Créer un compte
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
