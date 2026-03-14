import profilImg from './profil.png';
import Utilisateur from './Utilisateur.jsx';

function ProfilPage({ setPage }) {
  const currentUser = { /**objet qui représente l'utilisateur courrant */
    username: "L_M",
    firstName: "Lucas",
    lastName: "Martin",
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
            <ul>
              <li>
                <p><span>Utilisateur 1</span> -- <time>30/01/2024 à 13:53</time></p>
                <blockquote>Ceci est un deuxième message (<button>+</button>)</blockquote>
              </li>
              <li>
                <p><span>Utilisateur 2</span> -- <time>30/01/2024 à 13:51</time></p>
                <blockquote>
                  Ceci est un premier message (<button>+</button>)
                  <div id="msg20240130-135210">
                    <p><span>Utilisateur 1</span> -- <time>30/01/2024 à 13:52</time></p>
                    <blockquote>Ceci est une réponse (<button>+</button>)</blockquote>
                  </div>
                </blockquote>
              </li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

export default ProfilPage;