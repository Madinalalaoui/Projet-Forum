function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.photo} alt="Photo de profil" className="user-avatar" />
      <div className="user-info">
        <h2 className="user-fullname">{user.firstName} {user.lastName}</h2>
        <p className="user-username">@{user.username}</p>
        <span className={`user-role role-${user.role}`}>{user.role}</span>
      </div>
    </div>
  );
}

export default UserCard;
