function ForumType({forums, user, setCurrentForum}){
        //ne garder que les forums visibles
            //- si forum public , toujours affiché
            //- si privé , n'est affiché que si l'utilisateur est connecté
        const visibleForums = forums.filter(f=> !f.private || (user && user.role === "admin")); 

        return (
            <div>
                <h2>Forums disponibles pour vous :</h2>
                {/*on parcourt la liste des forums visibles */}
                {visibleForums.map(forum => (
                    <button //création d'un bouton pour chaque forum
                        key={forum.id}
                        onClick={() => setCurrentForum(forum)}
                    >
                        {forum.title} {/*affiche le nom du forum */}
                        {forum.private && "🔒"} {/*si le forum est privé, on affiche que c'est privé */}
                    </button>
                ))}
            </div>
        );

}
export default ForumType;