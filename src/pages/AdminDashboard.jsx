import { useState, useEffect } from 'react';
import { Shield, Check, X, ShieldPlus, ShieldMinus, Clock, Users } from 'lucide-react';
import { API_URL } from '../config.js';
import '../assets/styles/AdminDashboard.css';

function AdminDashboard({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchPending();
    fetchAllUsers();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_URL}/users/pending`);
      const data = await res.json();
      setPendingUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setAllUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleValidate = async (username) => {
    await fetch(`${API_URL}/users/${username}/validate`, { method: "PUT" });
    setPendingUsers(prev => prev.filter(u => u.username !== username));
    fetchAllUsers();
  };

  const handleReject = async (username) => {
    await fetch(`${API_URL}/users/${username}/reject`, { method: "PUT" });
    setPendingUsers(prev => prev.filter(u => u.username !== username));
  };

  const handleRoleChange = async (username, newRole) => {
    await fetch(`${API_URL}/users/${username}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole, requester: user.username }),
    });
    setAllUsers(prev => prev.map(u => u.username === username ? { ...u, role: newRole } : u));
  };

  return (
    <div className="admin-dashboard">

      <header className="admin-dashboard-header">
        <Shield size={22} />
        <h1>Dashboard Admin</h1>
      </header>
      <p className="admin-dashboard-subtitle">Gérez les inscriptions et les rôles des membres.</p>

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
