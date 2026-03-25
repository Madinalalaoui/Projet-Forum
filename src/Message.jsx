
function Message({auteur,date,contenu,reponses,id, onDelete, user}) { 
  
  const canDelete = user && auteur === user.username;

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
              />
            ))}
          </ul>
        )}
      </blockquote>
    </li>
  );
}

export default Message;