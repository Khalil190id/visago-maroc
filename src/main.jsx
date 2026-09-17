import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [trackingRef, setTrackingRef] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      birth_date: formData.get("birthDate"),
      nationality: formData.get("nationality"),
      passport: formData.get("passport"),
      passport_expiry: formData.get("passportExpiry"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      destination: formData.get("destination"),
      visa_type: formData.get("visaType"),
      travel_date: formData.get("travelDate"),
      travellers: Number(formData.get("travellers")) || 1,
      message: formData.get("message")
    };

    try {
      const response = await fetch("/api/visa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "Une erreur est survenue. Veuillez réessayer."
        );
      }

      setReference(result.reference);
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(
        err.message ||
          "Impossible d'envoyer la demande. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTracking = async () => {
    if (!trackingRef.trim()) {
      setTrackingError("Veuillez saisir votre numéro de dossier.");
      setTrackingResult(null);
      return;
    }

    setTrackingLoading(true);
    setTrackingError("");
    setTrackingResult(null);

    try {
      const response = await fetch(
        `/api/visa?reference=${encodeURIComponent(
          trackingRef.trim().toUpperCase()
        )}`
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "Dossier introuvable."
        );
      }

      setTrackingResult(result.request);
    } catch (err) {
      setTrackingError(
        err.message || "Impossible de rechercher le dossier."
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span>V</span> VisaGo Maroc
        </div>

        <nav>
          <a href="#services">Services</a>
          <a href="#visa">Demande Visa</a>
          <a href="#tracking">Suivi</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="language">FR ▾</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="badge">🌍 Visa & Voyage</div>

            <h1>
              Votre voyage
              <br />
              <span>commence ici.</span>
            </h1>

            <p>
              Déposez votre demande de visa facilement et préparez votre
              dossier avec VisaGo Maroc.
            </p>

            <div className="hero-buttons">
              <a href="#visa" className="btn primary">
                Commencer ma demande
              </a>

              <a href="#tracking" className="btn secondary">
                Suivre mon dossier
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="passport-icon">✈️</div>
            <h3>VisaGo Maroc</h3>
            <p>Votre assistant pour vos démarches de voyage.</p>

            <div className="mini-status">
              <span>✓</span>
              Dossier sécurisé
            </div>

            <div className="mini-status">
              <span>✓</span>
              Suivi en ligne
            </div>

            <div className="mini-status">
              <span>✓</span>
              Assistance personnalisée
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="section-title">
            <span>Nos services</span>
            <h2>Tout pour préparer votre voyage</h2>
          </div>

          <div className="services-grid">
            <Service
              icon="🛂"
              title="E-Visa"
              text="Découvrez les destinations proposant des visas électroniques."
            />

            <Service
              icon="📄"
              title="Assistance Visa"
              text="Préparez votre dossier avec notre accompagnement."
            />

            <Service
              icon="✈️"
              title="Vols"
              text="Solutions de réservation pour votre voyage."
            />

            <Service
              icon="🏨"
              title="Hôtels"
              text="Préparez votre hébergement."
            />

            <Service
              icon="🛡️"
              title="Assurance Voyage"
              text="Préparez votre assurance voyage."
            />

            <Service
              icon="📁"
              title="Packs Visa"
              text="Des services regroupés pour simplifier votre dossier."
            />
          </div>
        </section>

        <section id="visa" className="visa-section">
          <div className="section-title">
            <span>DEMANDE DE VISA</span>
            <h2>Déposez votre demande</h2>
            <p>
              Remplissez les informations ci-dessous. Notre équipe pourra
              ensuite examiner votre dossier.
            </p>
          </div>

          {!submitted ? (
            <form className="visa-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Votre prénom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date de naissance *</label>
                  <input
                    type="date"
                    name="birthDate"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nationalité *</label>
                  <input
                    type="text"
                    name="nationality"
                    placeholder="Exemple : Marocaine"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Numéro de passeport *</label>
                  <input
                    type="text"
                    name="passport"
                    placeholder="Numéro du passeport"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date d'expiration du passeport *</label>
                  <input
                    type="date"
                    name="passportExpiry"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+212 6 XX XX XX XX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="exemple@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Destination *</label>
                  <select name="destination" required>
                    <option value="">
                      Sélectionnez une destination
                    </option>
                    <option>Arabie Saoudite</option>
                    <option>Turquie</option>
                    <option>Égypte</option>
                    <option>Bahreïn</option>
                    <option>Émirats Arabes Unis</option>
                    <option>Royaume-Uni</option>
                    <option>Europe / Schengen</option>
                    <option>Autre destination</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Type de visa *</label>
                  <select name="visaType" required>
                    <option value="">
                      Sélectionnez le type
                    </option>
                    <option>Tourisme</option>
                    <option>Affaires</option>
                    <option>Visite familiale</option>
                    <option>Transit</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date prévue du voyage *</label>
                  <input
                    type="date"
                    name="travelDate"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nombre de voyageurs *</label>
                  <input
                    type="number"
                    name="travellers"
                    min="1"
                    max="20"
                    defaultValue="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Documents</label>
                <input
                  type="file"
                  name="documents"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <small>
                  Formats acceptés : PDF, JPG, JPEG, PNG
                </small>
              </div>

              <div className="form-group full">
                <label>
                  Message / Informations supplémentaires
                </label>

                <textarea
                  name="message"
                  rows="5"
                  placeholder="Écrivez votre message..."
                ></textarea>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                />

                <label htmlFor="privacy">
                  J'accepte que mes informations soient utilisées
                  pour traiter ma demande.
                </label>
              </div>

              {error && (
                <div className="error-box">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn primary submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Envoi en cours..."
                  : "Envoyer ma demande →"}
              </button>
            </form>
          ) : (
            <div className="success-box">
              <div className="success-icon">✓</div>

              <h2>Demande enregistrée</h2>

              <p>
                Votre demande a été enregistrée avec succès.
              </p>

              <div className="reference">
                <span>Votre numéro de dossier</span>
                <strong>{reference}</strong>
              </div>

              <p>
                Conservez précieusement ce numéro pour suivre
                votre dossier.
              </p>

              <button
                className="btn secondary"
                onClick={() => {
                  setSubmitted(false);
                  setReference("");
                  setError("");
                }}
              >
                Nouvelle demande
              </button>
            </div>
          )}
        </section>

        <section id="tracking" className="tracking section">
          <div className="section-title">
            <span>SUIVI</span>
            <h2>Suivez votre dossier</h2>
            <p>
              Entrez votre numéro de dossier.
            </p>
          </div>

          <div className="tracking-box">
            <input
              type="text"
              value={trackingRef}
              onChange={(e) =>
                setTrackingRef(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTracking();
                }
              }}
              placeholder="Exemple : VGM-2026-123456"
            />

            <button
              className="btn primary"
              onClick={handleTracking}
              disabled={trackingLoading}
            >
              {trackingLoading
                ? "Recherche..."
                : "Rechercher"}
            </button>
          </div>

          {trackingError && (
            <div className="error-box tracking-result">
              ❌ {trackingError}
            </div>
          )}

          {trackingResult && (
            <div className="tracking-result success-box">
              <div className="success-icon">✓</div>

              <h3>Dossier trouvé</h3>

              <p>
                Référence :{" "}
                <strong>{trackingResult.reference}</strong>
              </p>

              <p>
                Statut :{" "}
                <strong>{trackingResult.status}</strong>
              </p>

              <p>
                Date de réception :{" "}
                <strong>
                  {new Date(
                    trackingResult.created_at
                  ).toLocaleDateString("fr-FR")}
                </strong>
              </p>
            </div>
          )}
        </section>

        <section id="contact" className="contact section">
          <div>
            <span>Besoin d'aide ?</span>
            <h2>
              Notre équipe est à votre disposition.
            </h2>
          </div>

          <a
            className="whatsapp"
            href="https://wa.me/212600000000"
            target="_blank"
            rel="noreferrer"
          >
            💬 WhatsApp
          </a>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span>V</span> VisaGo Maroc
        </div>

        <p>
          © 2026 VisaGo Maroc. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

function Service({ icon, title, text }) {
  return (
    <div className="service-card">
      <div className="service-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>

      <a href="#visa">
        Découvrir →
      </a>
    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
