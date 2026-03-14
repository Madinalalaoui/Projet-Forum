
function Message({auteur,date,contenu,reponses}) { /**affiche un message avec son auteur, sa date, son contenu, et affiche récursivement ses réponses éventuelles*/
  return (
    <li>
      <p>
        <span>{auteur}</span> -- <time>{date}</time>
      </p>
      <blockquote> 
        {contenu}
        {reponses && reponses.length > 0 && (
          <ul>
            {reponses.map((rep,index) => (
              <Message
                auteur={rep.auteur}
                date={rep.date}
                contenu={rep.contenu}
                reponses={rep.reponses}
              />
            ))}
          </ul>
        )}
      </blockquote>
    </li>
  );
}

export default Message;