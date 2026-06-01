// Utilitaires purs pour manipuler le tableau de messages.
// Ces fonctions ne modifient jamais le tableau original (immutabilité React),
// elles retournent toujours un nouveau tableau.

// Crée un objet message avec un identifiant unique basé sur le timestamp + chaîne aléatoire,
// ce qui garantit l'unicité même si deux messages sont postés au même moment.
export function createMessage(username, contenu) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    auteur: username,
    createdAt: new Date().toISOString(),
    contenu,
    reponses: [],
    likes : []
  };
}

// Supprime un message par son id, en parcourant récursivement les réponses imbriquées.
// Utilise filter pour exclure le message cible, puis map pour descendre dans les réponses.
export function deleteRecursive(messages, id) {
  return messages
    .filter(msg => msg.id !== id)
    .map(msg => ({ ...msg, reponses: deleteRecursive(msg.reponses || [], id) }));
}

// Ajoute une réponse à un message donné par son id, en cherchant récursivement dans l'arbre.
// Retourne un nouveau tableau avec la réponse ajoutée au bon niveau de profondeur.
export function addReplyRecursive(messages, idMessage, reply) {
  return messages.map(msg => {
    if (msg.id === idMessage) {
      return { ...msg, reponses: [...(msg.reponses || []), reply] };
    }
    return { ...msg, reponses: addReplyRecursive(msg.reponses || [], idMessage, reply) };
  });
}

// Formate une date ISO en chaîne lisible en français (ex : "01/06/2025 à 10:30:00").
export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('fr-FR');
}

// Ajoute ou retire le like d'un utilisateur sur un message, récursivement dans l'arbre.
// Si l'utilisateur a déjà liké (son username est dans le tableau likes), on le retire (toggle).
// Sinon, on l'ajoute.
export function toggleLikeRecursive(messages, messageId, username) {
  return messages.map(msg => {
    if (msg.id === messageId) {
      const likes = Array.isArray(msg.likes) ? msg.likes : [];

      // Vérifie si l'utilisateur a déjà liké ce message
      const alreadyLiked = likes.includes(username);

      return {
        ...msg,
        likes: alreadyLiked
          ? likes.filter(u => u !== username)  // retire le like
          : [...likes, username]                // ajoute le like
      };
    }

    // Descend dans les réponses si le message n'est pas encore trouvé
    return {
      ...msg,
      reponses: toggleLikeRecursive(msg.reponses || [], messageId, username)
    };
  });
}
