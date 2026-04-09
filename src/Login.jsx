import { useState } from 'react';
import './Login.css'; // on va créer ce fichier

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Utilisateur ou mot de passe incorrect");
      const data = await res.json();
      props.login(data);
    } catch (err) {
      alert(err.message);
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Connexion</button>
          <button type="button">Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default Login;