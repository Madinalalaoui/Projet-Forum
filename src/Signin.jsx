import { useState } from 'react';

function Signin() {
  const [pass1,setPass1] = useState(""); /**socker le premier mot de passe saisi */
  const [pass2,setPass2] = useState(""); /**socker le deuxieme mot de passe saisi */
  const [passOK,setPassOK] = useState(null); /**savoir si les deux sont identiques */

  const handleSubmit = () => { /**fonction appellée lorsqu'on clique sur 'enregistrer' */
    if (pass1 === pass2) {
      setPassOK(true);
    } else {
      setPassOK(false); /**erreur */
    }
  };

  return (
    <div>
      <h1>Enregistrement</h1>
      <form>
        <label htmlFor="name" className="center">Prénom</label>
        <label htmlFor="lastname" className="center">Nom</label>
        <input id="name" />
        <input id="lastname" />

        <label htmlFor="login">Nom d'utilisateur</label>
        <input id="login" />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)} /**mettre à jour l’état pass1 avec la valeur saisie par l’utilisateur */
        />

        <label htmlFor="press_again">Retapez</label>
        <input
          id="press_again"
          type="password"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}/**mettre à jour l’état pass2*/
        />

        <button type="button" onClick={handleSubmit}>Enregistrer</button>   {/**bouton qui déclenche 'handleSubmit' pour vérifier si les deux mots de passe correspondent*/}
        <button type="button" onClick={() => { setPass1(""); setPass2(""); setPassOK(null); }}>Annuler</button>  {/**réinitialise les champs des mots de passe, ainsi que la verification*/}

        {passOK === false && <p style={{color:"red"}}>Erreur: mots de passe différents</p>} {/**affiche un message d'erreur en rouge si les deux password sont différents*/}
      </form>
    </div>
  );
}

export default Signin;