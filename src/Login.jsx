import { useState } from 'react';

function Login (props){
    const [username, setUsername] = useState(""); /**etat pour stocker le nom d'utilisateur */
    const [password, setPassword] = useState(""); /**stocker le mot de passe */

    const getLogin = (evt) => {setUsername(evt.target.value)} /**fonctions pour mettre à jour les états lors des saisies*/
    const getPassword = (evt) => {setPassword(evt.target.value)}

    return (
    <div>
      <h1>Ouvrir une session</h1>
      <form>
        <label htmlFor="login">Nom d'utilisateur</label>
        <input id="login" />

        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" />

        <button onClick={props.login}>Connexion</button>
        <button type="button">Annuler</button>
      </form>
    </div>
  );
}
export default Login ;