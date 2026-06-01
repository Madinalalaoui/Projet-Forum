import { NavLink } from 'react-router-dom';
import { MessageSquare, User, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';

// Barre de navigation principale, présente sur toutes les pages.
// Affiche des liens différents selon l'état de connexion de l'utilisateur :
// - Non connecté : Se connecter / Créer un compte
// - Connecté : Forum / Profil / Admin (si admin) + bouton Déconnexion
// NavLink applique automatiquement la classe "active" sur le lien de la page courante.
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
            {/* Lien vers le profil de l'utilisateur connecté via son username dans l'URL */}
            <NavLink to={`/profil/${user?.username}`}>
              <User size={15} />
              {user?.username}
            </NavLink>
            {/* Lien admin visible uniquement si l'utilisateur a le rôle "admin" */}
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

      {/* Bouton de déconnexion : efface le localStorage via le callback logout de App */}
      {isConnected && (
        <button
          className="nav-logout"
          onClick={() => {
            console.log("utilisateur déconnecté :", user?.username);
            logout();
          }}
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      )}
    </nav>
  );
}

export default NavigationPanel;
