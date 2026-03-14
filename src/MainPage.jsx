
import { useState } from 'react';
import NavigationPanel from './NavigationPanel.jsx';
import Signin from './Signin.jsx';
import ProfilPage from './ProfilPage.jsx';
import ForumPage from './ForumPage.jsx';
import Login from './Login.jsx';

function MainPage() {
  const [page, setPage] = useState("login_page"); //indique quelle page afficher
  const [isConnected, setConnect] = useState(true); //permet de mettre à jour l'etat de connexion

  const getConnected = () => {
    setConnect(true);
    setPage("forum_page"); //si user connecté -> afficher page forum
  };

  const setLogout = () => {
    setConnect(false);
    setPage("login_page"); //si dans le cas non connecté -> on est sur la page de connexion
  };

  return (
    <div>
      <NavigationPanel  //adapte les boutons en fonction de l'etat de connexion
        login={getConnected}
        logout={setLogout}
        isConnected={isConnected}
        setPage={setPage} 
      />

      {/**affichage des pages dépendant de l'etat de la page */}
      {page === "login_page" && <Login login={getConnected} />}
      {page === "signin_page" && <Signin />}
      {page === "forum_page" && <ForumPage setPage={setPage} />}
      {page === "profil_page" && <ProfilPage setPage={setPage} />}
    </div>
  );
}

export default MainPage;





    
