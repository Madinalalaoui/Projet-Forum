
/**afficher les infos de l'utilisateur */
function Utilisateur({ user }) {
  return (
    <div>
      <img src={user.photo} alt="Profil" width={100} />
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Nom d'utilisateur : {user.username}</p>
      <p>Rôle : <strong>{user.role}</strong></p> 
    </div>
  );
}

export default Utilisateur;