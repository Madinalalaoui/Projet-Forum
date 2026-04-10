import { useEffect, useState } from 'react';
import NavigationPanel from './NavigationPanel.jsx';
import Signup from './Signup.jsx';
import ProfilPage from './ProfilPage.jsx';
import ForumPage from './ForumPage.jsx';
import Login from './Login.jsx';

function MainPage() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("forum_page");
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [messages, setMessages] = useState([]);

  const forums = [
  { id:1, title:"Forum Public", private:false },
  { id:2, title:"Forum Privé", private:true }
];

const [currentForum, setCurrentForum] = useState(forums[0]);

  const getConnected = (userData) => {
    setUser(userData);
    setPage("forum_page");
  };

  const setLogout = () => {
    setUser(null);
    setPage("login_page");
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch("http://localhost:3001/messages");
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Impossible de charger les messages:", error);
      } finally {
        setMessagesLoaded(true);
      }
    };

    loadMessages();
  }, []);

  useEffect(() => {
    if (!messagesLoaded) return;

    const saveMessages = async () => {
      try {
        await fetch("http://localhost:3001/messages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
      } catch (error) {
        console.error("Impossible de sauvegarder les messages:", error);
      }
    };

    saveMessages();
  }, [messages, messagesLoaded]);

  return (
    <div>
      <NavigationPanel
        login={getConnected}
        logout={setLogout}
        isConnected={!!user}
        setPage={setPage} 
      />

      {page === "login_page" && <Login login={getConnected} />}
      {page === "signup_page" && <Signup/>}
      {page === "forum_page" && <ForumPage user={user} setUser={setUser} setPage={setPage} forum={currentForum} 
      forums={forums} setCurrentForum={setCurrentForum} messages={messages} setMessages={setMessages}/>}
      {page === "profil_page" && <ProfilPage setPage={setPage} user={user} messages={messages} />}
    </div>
  );
}

export default MainPage;




    
