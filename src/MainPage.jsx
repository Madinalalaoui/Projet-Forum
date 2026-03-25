import { useState } from 'react';
import NavigationPanel from './NavigationPanel.jsx';
import Signin from './Signin.jsx';
import ProfilPage from './ProfilPage.jsx';
import ForumPage from './ForumPage.jsx';
import Login from './Login.jsx';

function MainPage() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("forum_page");

  const getConnected = (userData) => {
    setUser(userData);
    setPage("forum_page");
  };

  const setLogout = () => {
    setUser(null);
    setPage("login_page");
  };

  return (
    <div>
      <NavigationPanel
        login={getConnected}
        logout={setLogout}
        isConnected={!!user}
        setPage={setPage} 
      />

      {page === "login_page" && <Login login={getConnected} />}
      {page === "signin_page" && <Signin />}
      {page === "forum_page" && <ForumPage user={user} setUser={setUser} setPage={setPage} />}
      {page === "profil_page" && <ProfilPage setPage={setPage} user={user}   />}
    </div>
  );
}

export default MainPage;




    
