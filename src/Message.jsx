
import { useState } from 'react'; 

function Message({auteur,date,contenu,reponses,id, onDelete, user, onReply}) { 
  
  const [showReply, setShowReply] = useState(false);
  const [texte, setTexte] = useState("");
  const canDelete = user && (auteur === user.username || user.role === "admin");


   const handleReply = (e) => { 
    e.preventDefault();
    if (!texte) return;

    onReply(id, {
      id: Date.now(),
      auteur: user.username,
      date: new Date().toLocaleString(),
      contenu: texte,
      reponses: []
    });

    setTexte("");
    setShowReply(false);
  }; 

  return (
    <li>
      <p>
        <span>{auteur}</span> -- <time>{date}</time>
      </p>
      <blockquote> 
        {contenu}

        {canDelete && (
          <button onClick={() => onDelete(id)}>
            Supprimer
          </button>
        )}

        {user && ( 
          <button onClick={() => setShowReply(!showReply)}> 
            + 
          </button>
        )}

        {showReply && ( 
          <form onSubmit={handleReply}> 
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
            />
            <button type="submit">Répondre</button>
          </form>
        )} 

        {reponses && reponses.length > 0 && (
          <ul>
            {reponses.map((rep,index) => (
              <Message
                key={index}
                auteur={rep.auteur}
                date={rep.date}
                contenu={rep.contenu}
                reponses={rep.reponses}
                id={rep.id}
                onDelete={onDelete}
                user={user}
                onReply={onReply} 
              />
            ))}
          </ul>
        )}
      </blockquote>
    </li>
  );
}

export default Message;