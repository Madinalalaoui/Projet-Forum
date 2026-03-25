import profilImg from './profil.png';
import Utilisateur from './Utilisateur.jsx';

function ProfilPage({ setPage, user }) {
  
  const currentUser = { /**objet qui représente l'utilisateur courrant */
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
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
             <button onClick={() => setPage("forum_page")}>Accueil</button> {/**acceuil -> redirection vers le forum*/}
          </div>
        </div>
      </header>

      <main>
        <Utilisateur user={currentUser} /> {/**afficher les infos de l'utilisateur */}

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