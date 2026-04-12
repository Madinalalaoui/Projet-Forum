import { NavLink } from 'react-router-dom';
import { MessageSquare, User, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';

function NavigationPanel({ user, isConnected, logout }) {
  return (
    <nav>
      <NavLink className="nav-brand" to="/forum">
        Organiz'asso
      </NavLink>

      <div className="nav-links">
        {isConnected ? (
          <>
            <NavLink to="/forum">
              <MessageSquare size={15} />
              Forum
            </NavLink>
            <NavLink to={`/profil/${user?.username}`}>
              <User size={15} />
              {user?.username}
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin">
                <Shield size={15} />
                Admin
              </NavLink>
            )}
          </>
        ) : (
          <>
            <NavLink to="/login">
              <LogIn size={15} />
              Se connecter
            </NavLink>
            <NavLink to="/signup">
              <UserPlus size={15} />
              Créer un compte
            </NavLink>
          </>
        )}
      </div>

      {isConnected && (
        <button className="nav-logout" onClick={logout}>
          <LogOut size={14} />
          Déconnexion
        </button>
      )}
    </nav>
  );
}

export default NavigationPanel;
