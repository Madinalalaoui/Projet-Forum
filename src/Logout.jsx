function Logout (props) {

    return ( /**appeller la fonction de deconnexion dans Mainpage */
        <div>
            <button onClick={props.logout}>Déconnexion</button> 
        </div>
    );

} 

export default Logout;