import { useState } from 'react';
import { API_URL } from '../config.js';
import '../assets/styles/Signup.css';

function SignupPage({ setPage }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!username.trim() || !pass1.trim()) {
      setError("Nom d'utilisateur et mot de passe requis.");
      return;
    }

    if (pass1 !== pass2) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass1, firstName, lastName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      setSuccess(true);
      setTimeout(() => setPage('login_page'), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setPass1(''); setPass2('');
    setUsername(''); setFirstName(''); setLastName('');
    setError(''); setSuccess(false);
  };

  return (
    <div className="signin-container">
      <h1>Créer un compte</h1>
      <form className="signin-form" onSubmit={(e) => e.preventDefault()}>

        <div className="form-group">
          <label htmlFor="firstname">Prénom</label>
          <input id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Nom</label>
          <input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="password1">Mot de passe</label>
          <div className="password-wrapper">
            <input
              id="password1"
              type={showPassword1 ? 'text' : 'password'}
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword1(!showPassword1)}>
              {showPassword1 ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password2">Confirmer le mot de passe</label>
          <div className="password-wrapper">
            <input
              id="password2"
              type={showPassword2 ? 'text' : 'password'}
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword2(!showPassword2)}>
              {showPassword2 ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Compte créé ! Redirection vers la connexion…</p>}

        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={success}>
            S'inscrire
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Effacer
          </button>
        </div>

        <p className="form-switch">
          Déjà inscrit ?{" "}
          <button className="link-btn" onClick={() => setPage("login_page")}>
            Se connecter
          </button>
        </p>

      </form>
    </div>
  );
}

export default SignupPage;
