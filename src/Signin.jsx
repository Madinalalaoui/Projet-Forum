import { useState } from 'react';
import './Signin.css';

function Signin({ setPage }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [passOK, setPassOK] = useState(null);

  const handleSubmit = () => {
    if (pass1 !== pass2) {
      setPassOK(false);
      return;
    }
    setPassOK(true);
    alert('Utilisateur enregistré !');
  };

  return (
    <div className="signin-container">
      <h1>Enregistrement</h1>
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
          <label htmlFor="password2">Retapez le mot de passe</label>
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

        <div className="form-actions">
          <button type="button" onClick={handleSubmit}>Enregistrer</button>
          <button type="button" onClick={() => {
            setPass1(''); setPass2(''); setPassOK(null);
            setUsername(''); setFirstName(''); setLastName('');
          }}>Annuler</button>
        </div>

        {passOK === false && <p className="error-message">Erreur : mots de passe différents</p>}
      </form>
    </div>
  );
}

export default Signin;