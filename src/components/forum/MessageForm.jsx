import { useState } from 'react';
import { Send } from 'lucide-react';
import { createMessage } from '../../utils/messages.js';

// Formulaire de saisie d'un nouveau message.
// N'est rendu que si un utilisateur est connecté (retourne null sinon).
// À la soumission, crée un objet message via createMessage et le remonte au parent via addMsg.
function MessageForm({ addMsg, user }) {
  const [contenu, setContenu] = useState('');

  // Cache le formulaire si aucun utilisateur n'est connecté
  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ignore les soumissions vides ou contenant seulement des espaces
    if (!contenu.trim()) return;
    addMsg(createMessage(user.username, contenu));
    console.log("utilisateur a posté un message :", user.username);
    // Réinitialise le champ après envoi
    setContenu('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows={3}
        placeholder="Écrire un message..."
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        <Send size={14} />
        Envoyer
      </button>
    </form>
  );
}

export default MessageForm;
