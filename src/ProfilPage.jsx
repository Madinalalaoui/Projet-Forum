import profilImg from './assets/profil.png';
import Utilisateur from './Utilisateur.jsx';

function ProfilPage({ setPage, user, messages = [] }) {
  const getUserMessages = (allMessages, username) => {
    const result = [];

    const visit = (list) => {
      list.forEach((msg) => {
        if (msg.auteur === username) {
          result.push(msg);
        }

        if (msg.reponses && msg.reponses.length > 0) {
          visit(msg.reponses);
        }
      });
    };

    visit(allMessages);
    return result;
  };

  if (!user) {
    return <main><p>Connectez-vous pour voir votre profil.</p></main>;
  }

  const userMessages = getUserMessages(messages, user.username);

  const currentUser = {
    username: user?.username,
    firstName: user?.firstName,
    lastName: user?.lastName,
    role: user?.role,     
    photo: profilImg
  };

  return (

      <main>
        <Utilisateur user={currentUser} /> {/* le rôle sera disponible ici */}

        <section id="listsmsgs">
          <article>
            <p>Liste des messages</p>
            {userMessages.length === 0 ? (
              <p>Aucun message publié pour le moment.</p>
            ) : (
              <ul>
                {userMessages.map((msg) => (
                  <li key={msg.id}>
                    <p><strong>{msg.date}</strong></p>
                    <p>{msg.contenu}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </main>
  );
}

export default ProfilPage;