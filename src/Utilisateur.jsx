
/**afficher les infos de l'utilisateur */
function Utilisateur({user}) {
  return (
    <aside id="userBanner">
      <section id="infoUtil">
        <p>Nom d'utilisateur : {user.username}</p>
        <p>Prénom : {user.firstName}</p>
        <p>Nom : {user.lastName}</p>
      </section>

      <section id="photoprofil">
        <p>Photo de profil :</p>
        <img src={user.photo} alt="photo de profil" width={100} />
      </section>
    </aside>
  );
}

export default Utilisateur;