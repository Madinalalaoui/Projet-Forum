import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';
import '../assets/styles/Signup.css';

// Page d'inscription.
// Valide les champs côté client avant d'envoyer la requête POST /signup.
// Après succès, affiche un message de confirmation et redirige vers /login après 2,5 secondes.
// Note : le premier compte créé devient automatiquement admin (logique gérée côté serveur).
function SignupPage() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    // Validation côté client : champs obligatoires
    if (!username.trim() || !pass1.trim()) {
      setError("Nom d'utilisateur et mot de passe requis.");
      return;
    }

    // Vérification de la correspondance des deux mots de passe
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

      // Affiche le message de succès et redirige automatiquement vers la connexion
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  // Réinitialise tous les champs du formulaire
  const handleReset = () => {
    setPass1(''); setPass2('');
    setUsername(''); setFirstName(''); setLastName('');
    setError(''); setSuccess(false);
  };

  return (
    <div className="signin-container">
      <h1>Créer un compte</h1>
      {/* onSubmit empêche le rechargement de page ; la soumission est gérée par handleSubmit */}
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
          {/* disabled pendant le succès pour éviter une double soumission */}
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={success}>
            S'inscrire
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Effacer
          </button>
        </div>

        <p className="form-switch">
          Déjà inscrit ?{" "}
          <button className="link-btn" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        </p>

      </form>
    </div>
  );
}

export default SignupPage;
