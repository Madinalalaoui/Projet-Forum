import { useState } from 'react';

function Login (props){
    const [username, setUsername] = useState(""); /**etat pour stocker le nom d'utilisateur */
    const [password, setPassword] = useState(""); /**stocker le mot de passe */

    const getLogin = (evt) => {setUsername(evt.target.value)} /**fonctions pour mettre à jour les états lors des saisies*/
    const getPassword = (evt) => {setPassword(evt.target.value)}


    const handleSubmit = (e) => {
    e.preventDefault();

    props.login({
      username: username,
      role: "member"
    });
  };

return (
    <div>
      <h1>Ouvrir une session</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Nom d'utilisateur</label>
        <input
          id="login"
          value={username}
          onChange={getLogin}
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={getPassword}
        />

        <button type="submit">Connexion</button>
        <button type="button">Annuler</button>
      </form>
    </div>
  );
}


export default Login ;