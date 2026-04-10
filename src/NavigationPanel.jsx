
function NavigationPanel({ user, isConnected,setPage,logout }) {
  return (
    <nav>
      {isConnected ? (   
        <> {/**si l'utilisateur est connecté -> forum et profil changent la page via setPage,et deconnexion appelle logout*/}
          <button onClick={() => setPage("forum_page")}>Forum</button>

          <button onClick={() => setPage("profil_page")}>Profil</button>
          
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <> {/**sinon -> boutons 'Se connecter' et 'Créer un compte' qui changent la page via setPage*/}
          <button onClick={() => setPage("login_page")}>Se connecter</button>
          <button onClick={() => setPage("signup_page")}>Créer un compte</button>
        </>
      )}
    </nav>
  );
}

export default NavigationPanel;

