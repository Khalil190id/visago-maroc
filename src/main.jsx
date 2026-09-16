import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span>V</span> VisaGo Maroc
        </div>

        <nav>
          <a href="#services">Services</a>
          <a href="#visa">E-Visa</a>
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
              Demandez votre visa, préparez votre dossier et organisez votre
              voyage facilement avec VisaGo Maroc.
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
            <p>Une plateforme simple pour préparer votre voyage.</p>

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
            <Service icon="🛂" title="E-Visa" text="Découvrez les destinations proposant des visas électroniques." />
            <Service icon="📄" title="Assistance Visa" text="Préparez votre dossier avec notre accompagnement." />
            <Service icon="✈️" title="Vols" text="Solutions de réservation et documents pour votre voyage." />
            <Service icon="🏨" title="Hôtels" text="Trouvez et préparez votre hébergement." />
            <Service icon="🛡️" title="Assurance Voyage" text="Préparez votre assurance voyage." />
            <Service icon="📁" title="Packs Visa" text="Des services regroupés pour simplifier votre dossier." />
          </div>
        </section>

        <section id="visa" className="visa-section">
          <div>
            <span className="section-label">VISA</span>
            <h2>Commencez votre demande</h2>
            <p>
              Sélectionnez votre destination et commencez votre dossier.
            </p>
          </div>

          <div className="visa-form">
            <label>Destination</label>
            <select>
              <option>Sélectionnez une destination</option>
              <option>Arabie Saoudite</option>
              <option>Turquie</option>
              <option>Égypte</option>
              <option>Bahreïn</option>
              <option>Autres destinations</option>
            </select>

            <button className="btn primary">
              Continuer
            </button>
          </div>
        </section>

        <section id="tracking" className="tracking section">
          <div className="section-title">
            <span>Suivi</span>
            <h2>Suivez votre dossier</h2>
          </div>

          <div className="tracking-box">
            <input
              type="text"
              placeholder="Exemple : VGM-2026-000123"
            />

            <button className="btn primary">
              Rechercher
            </button>
          </div>
        </section>

        <section id="contact" className="contact section">
          <div>
            <span>Besoin d'aide ?</span>
            <h2>Notre équipe est à votre disposition.</h2>
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

        <p>© 2026 VisaGo Maroc. Tous droits réservés.</p>
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
      <a href="#visa">Découvrir →</a>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
