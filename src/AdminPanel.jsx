function AdminPanel({ user }) {

  if (!user || user.role !== "admin")
    return null;

  return (
    <div>
      <h2>Panel Admin</h2>

      <p>Vous êtes connecté en tant qu'admin, vous pouvez supprimer tous les messages et accéder aux forums privés.</p>

    </div>
  );
}

export default AdminPanel;