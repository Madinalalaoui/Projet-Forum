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

export function deleteRecursive(messages, id) {
  return messages
    .filter(msg => msg.id !== id)
    .map(msg => ({ ...msg, reponses: deleteRecursive(msg.reponses || [], id) }));
}

export function addReplyRecursive(messages, idMessage, reply) {
  return messages.map(msg => {
    if (msg.id === idMessage) {
      return { ...msg, reponses: [...(msg.reponses || []), reply] };
    }
    return { ...msg, reponses: addReplyRecursive(msg.reponses || [], idMessage, reply) };
  });
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('fr-FR');
}


export function toggleLikeRecursive(messages, messageId, username) {
  return messages.map(msg => {
    if (msg.id === messageId) {
      const likes = Array.isArray(msg.likes) ? msg.likes : [];

      const alreadyLiked = likes.includes(username);

      return {
        ...msg,
        likes: alreadyLiked
          ? likes.filter(u => u !== username)
          : [...likes, username]
      };
    }

    return {
      ...msg,
      reponses: toggleLikeRecursive(msg.reponses || [], messageId, username)
    };
  });
}