import { useState } from 'react';
import { Send } from 'lucide-react';

function MessageForm({ addMsg, user }) {
  const [contenu, setContenu] = useState('');

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contenu.trim()) return;

    addMsg({
      id: Date.now(),
      auteur: user.username,
      date: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      contenu,
    });

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
