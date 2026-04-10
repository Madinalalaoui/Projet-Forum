import { MessageSquare, User, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';

function NavigationPanel({ user, isConnected, page, setPage, logout }) {
  return (
    <nav>
      <button className="nav-brand" onClick={() => setPage("forum_page")}>
        Organiz'asso
      </button>

      <div className="nav-links">
        {isConnected ? (
          <>
            <button
              className={page === "forum_page" ? "active" : ""}
              onClick={() => setPage("forum_page")}
            >
              <MessageSquare size={15} />
              Forum
            </button>
            {/* Le bouton Profil affiche directement le pseudo — pas de doublon */}
            <button
              className={page === "profil_page" ? "active" : ""}
              onClick={() => setPage("profil_page")}
            >
              <User size={15} />
              {user?.username}
            </button>
            {user?.role === "admin" && (
              <button
                className={page === "admin_page" ? "active" : ""}
                onClick={() => setPage("admin_page")}
              >
                <Shield size={15} />
                Admin
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className={page === "login_page" ? "active" : ""}
              onClick={() => setPage("login_page")}
            >
              <LogIn size={15} />
              Se connecter
            </button>
            <button
              className={page === "signup_page" ? "active" : ""}
              onClick={() => setPage("signup_page")}
            >
              <UserPlus size={15} />
              Créer un compte
            </button>
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
