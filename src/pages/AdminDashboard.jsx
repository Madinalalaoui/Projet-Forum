import { useState, useEffect } from 'react';
import { Shield, Check, X, ShieldPlus, ShieldMinus, Clock, Users } from 'lucide-react';
import { API_URL } from '../config.js';
import '../assets/styles/AdminDashboard.css';

// Tableau de bord réservé aux administrateurs.
// Accessible uniquement si user.role === "admin" (vérification dans App via React Router).
// Permet de : valider ou rejeter les inscriptions en attente, et modifier le rôle des membres.
function AdminDashboard({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]); // Comptes en attente de validation
  const [allUsers, setAllUsers] = useState([]);         // Tous les membres validés

  // Charge les deux listes au montage du composant
  useEffect(() => {
    fetchPending();
    fetchAllUsers();
  }, []);

  // Récupère les utilisateurs en statut "pending" depuis GET /users/pending
  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_URL}/users/pending`);
      const data = await res.json();
      setPendingUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Récupère tous les membres validés depuis GET /users
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setAllUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Valide un compte : appelle PUT /users/:username/validate puis met à jour l'état local
  // sans refetch complet (retire l'utilisateur de la liste pending et rafraîchit la liste complète).
  const handleValidate = async (username) => {
    await fetch(`${API_URL}/users/${username}/validate`, { method: "PUT" });
    setPendingUsers(prev => prev.filter(u => u.username !== username));
    fetchAllUsers(); // Rafraîchit la liste des membres pour inclure le nouveau validé
  };

  // Rejette un compte : appelle PUT /users/:username/reject (supprime le document en base)
  const handleReject = async (username) => {
    await fetch(`${API_URL}/users/${username}/reject`, { method: "PUT" });
    setPendingUsers(prev => prev.filter(u => u.username !== username));
  };

  // Modifie le rôle d'un membre via PUT /users/:username/role.
  // Envoie aussi le username de l'admin demandeur pour que le serveur puisse interdire
  // à un admin de modifier son propre rôle.
  const handleRoleChange = async (username, newRole) => {
    await fetch(`${API_URL}/users/${username}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole, requester: user.username }),
    });
    // Mise à jour optimiste de l'état local : pas besoin de refetch
    setAllUsers(prev => prev.map(u => u.username === username ? { ...u, role: newRole } : u));
  };

  return (
    <div className="admin-dashboard">

      <header className="admin-dashboard-header">
        <Shield size={22} />
        <h1>Dashboard Admin</h1>
      </header>
      <p className="admin-dashboard-subtitle">Gérez les inscriptions et les rôles des membres.</p>

      {/* Statistiques rapides : nombre d'inscriptions en attente et de membres actifs */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon pending">
            <Clock size={18} />
          </div>
          <div>
            <div className="admin-stat-value">{pendingUsers.length}</div>
            <div className="admin-stat-label">En attente de validation</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon members">
            <Users size={18} />
          </div>
          <div>
            <div className="admin-stat-value">{allUsers.length}</div>
            <div className="admin-stat-label">Membres actifs</div>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid">

        {/* Section : inscriptions en attente */}
        <section className="admin-card">
          <h2 className="admin-card-title">
            <Clock size={15} />
            Inscriptions en attente
            {pendingUsers.length > 0 && (
              <span className="admin-badge">{pendingUsers.length}</span>
            )}
          </h2>

          {pendingUsers.length === 0 ? (
            <p className="admin-empty">Aucune inscription en attente.</p>
          ) : (
            <ul className="admin-user-list">
              {pendingUsers.map(u => (
                <li key={u.username} className="admin-user-item">
                  <div className="admin-user-avatar">{u.username.charAt(0).toUpperCase()}</div>
                  <div className="admin-user-info">
                    <span className="admin-user-fullname">{u.firstName} {u.lastName}</span>
                    <span className="admin-user-username">@{u.username}</span>
                  </div>
                  <div className="admin-user-actions">
                    <button className="btn-validate" onClick={() => handleValidate(u.username)}>
                      <Check size={13} /> Valider
                    </button>
                    <button className="btn-danger" onClick={() => handleReject(u.username)}>
                      <X size={13} /> Rejeter
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Section : gestion des rôles des membres validés */}
        <section className="admin-card">
          <h2 className="admin-card-title">
            <Users size={15} />
            Membres
            <span className="admin-badge" style={{ background: 'var(--text-muted)' }}>{allUsers.length}</span>
          </h2>

          {allUsers.length === 0 ? (
            <p className="admin-empty">Aucun membre.</p>
          ) : (
            <ul className="admin-user-list">
              {allUsers.map(u => (
                <li key={u.username} className="admin-user-item">
                  <div className="admin-user-avatar">{u.username.charAt(0).toUpperCase()}</div>
                  <div className="admin-user-info">
                    <span className="admin-user-fullname">{u.firstName} {u.lastName}</span>
                    <span className="admin-user-username">@{u.username}</span>
                    <span className={`user-role role-${u.role}`}>{u.role}</span>
                  </div>
                  <div className="admin-user-actions">
                    {/* L'admin connecté ne peut pas modifier son propre rôle */}
                    {u.username === user.username ? (
                      <span className="admin-self-label">Vous</span>
                    ) : u.role === "member" ? (
                      <button className="btn-validate" onClick={() => handleRoleChange(u.username, "admin")}>
                        <ShieldPlus size={13} /> Promouvoir
                      </button>
                    ) : (
                      <button className="btn-danger" onClick={() => handleRoleChange(u.username, "member")}>
                        <ShieldMinus size={13} /> Rétrograder
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;
