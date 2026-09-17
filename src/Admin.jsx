import React, { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Mot de passe incorrect");
      }

      setLogged(true);
      loadRequests(password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async (adminPassword = password) => {
    try {
      const response = await fetch("/api/admin/requests", {
        headers: {
          "X-Admin-Password": adminPassword
        }
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Erreur");
      }

      setRequests(result.requests || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (reference, status) => {
    try {
      const response = await fetch("/api/admin/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": password
        },
        body: JSON.stringify({
          reference,
          status
        })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Erreur");
      }

      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!logged) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <div style={styles.logo}>
            <span>V</span> VisaGo Maroc
          </div>

          <h1>Administration</h1>

          <p>Connectez-vous à votre espace administrateur.</p>

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
            style={styles.input}
          />

          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <a href="/" style={styles.back}>
            ← Retour au site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>V</span> VisaGo Maroc
        </div>

        <div>
          <strong>Administration</strong>

          <button
            onClick={() => {
              setLogged(false);
              setPassword("");
              setRequests([]);
            }}
            style={styles.logout}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.titleRow}>
          <div>
            <h1>Demandes de visa</h1>
            <p>
              {requests.length} dossier(s)
            </p>
          </div>

          <button
            onClick={() => loadRequests()}
            style={styles.refresh}
          >
            ↻ Actualiser
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Destination</th>
                <th>Visa</th>
                <th>Téléphone</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.reference}</strong>
                  </td>

                  <td>
                    {request.first_name}{" "}
                    {request.last_name}
                  </td>

                  <td>{request.destination}</td>

                  <td>{request.visa_type}</td>

                  <td>{request.phone}</td>

                  <td>
                    {new Date(
                      request.created_at
                    ).toLocaleDateString("fr-FR")}
                  </td>

                  <td>
                    <select
                      value={request.status}
                      onChange={(e) =>
                        updateStatus(
                          request.reference,
                          e.target.value
                        )
                      }
                      style={styles.status}
                    >
                      <option>Nouveau</option>
                      <option>En cours</option>
                      <option>Approuvé</option>
                      <option>Refusé</option>
                    </select>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={styles.empty}
                  >
                    Aucun dossier trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif"
  },

  loginBox: {
    width: "380px",
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,.10)"
  },

  logo: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "25px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600"
  },

  back: {
    display: "block",
    marginTop: "20px",
    textAlign: "center",
    color: "#555"
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px"
  },

  dashboard: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif"
  },

  header: {
    background: "#fff",
    padding: "20px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee"
  },

  logout: {
    marginLeft: "20px",
    padding: "8px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer"
  },

  main: {
    padding: "40px 5%"
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },

  refresh: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
    background: "#111827",
    color: "#fff",
    cursor: "pointer"
  },

  tableWrapper: {
    background: "#fff",
    borderRadius: "15px",
    overflowX: "auto",
    boxShadow: "0 8px 30px rgba(0,0,0,.06)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px"
  },

  status: {
    padding: "8px",
    borderRadius: "7px",
    border: "1px solid #ddd"
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#777"
  }
};
