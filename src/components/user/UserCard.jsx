import profilImg from '../../assets/images/profil.png';

function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={profilImg} alt="Photo de profil" className="user-avatar" />
      <div className="user-info">
        <h2 className="user-fullname">{user.firstName}<br />{user.lastName}</h2>
        <p className="user-username">@{user.username}</p>
        <span className={`user-role role-${user.role}`}>{user.role}</span>
      </div>
    </div>
  );
}

export default UserCard;
