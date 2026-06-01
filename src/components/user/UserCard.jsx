// Carte de présentation d'un utilisateur affichée sur la page de profil.
// Reçoit un objet user avec : photo, firstName, lastName, username, role.
// Le badge de rôle utilise une classe CSS dynamique (role-admin ou role-member).
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.photo} alt="Photo de profil" className="user-avatar" />
      <div className="user-info">
        <h2 className="user-fullname">{user.firstName} {user.lastName}</h2>
        <p className="user-username">@{user.username}</p>
        {/* Classe CSS dynamique pour différencier visuellement admin et member */}
        <span className={`user-role role-${user.role}`}>{user.role}</span>
      </div>
    </div>
  );
}

export default UserCard;
