
import { useState } from 'react';

function FormulaireSaisieMessage({addMsg, user}) {
  const [contenu, setContenu] = useState(''); //etat pour stocker le texte saisi 

  if (!user) return null;

  const handleSubmit = (e) => { //fonction appellée à l'envoi du formulaire 
    e.preventDefault();
    if (!contenu) return; //si le champ est vide ne rien faire 
    addMsg({ //envoie le nouveau message au parent pour l'ajouter à la liste
      id: Date.now(), //afin de connaitre le message précis qu'on voudra supprimer 
      auteur: user.username,           
      date: new Date().toLocaleString(), //date et heure actuelles
      createdAt: new Date().toISOString(),
      contenu,
    });
    setContenu('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows={3}
        cols={50}
        placeholder="Écrire un message..."
        value={contenu}
        onChange={(e) => setContenu(e.target.value)} //met à jour l'etat à chqaue saisie
      />
      <br />
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default FormulaireSaisieMessage;