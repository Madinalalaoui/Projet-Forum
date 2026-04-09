import profilImg from './profil.png';
import Utilisateur from './Utilisateur.jsx';

function ProfilPage({ setPage, user }) {
  const currentUser = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,     
    photo: profilImg
  };

  return (
    <div>
      <header>
        <div id="gauche">
          <div id="forum">
            <p>Nom Forum</p>
          </div>
          <div id="acc">
            <button onClick={() => setPage("forum_page")}>Accueil</button>
          </div>
        </div>
      </header>

      <main>
        <Utilisateur user={currentUser} /> {/* le rôle sera disponible ici */}

        <section id="listsmsgs">
          <article>
            <p>Liste des messages :</p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default ProfilPage;