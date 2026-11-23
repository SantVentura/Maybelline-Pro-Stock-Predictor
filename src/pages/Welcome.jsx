import { ArrowRight } from "lucide-react";
import "./Welcome.css";

function Welcome({ userName = "", onStart }) {
  const firstName = userName.trim().split(/\s+/)[0];
  return (
    <main className="welcome">
      <div className="welcome-overlay"></div>

      <section className="welcome-content">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <span className="brand-name">Maybelline Pro Stock Predictor</span>
        </div>

        <div className="welcome-text">
          {firstName && (
            <p className="welcome-personal-greeting">¡Hola, {firstName}! ✨</p>
          )}
          <p className="eyebrow">TU KIT, SIEMPRE LISTO</p>

          <h1>
            Nunca te quedes
            <br />
            sin la base.
          </h1>

          <p className="welcome-description">
            Controla tu maquillaje, recibe alertas y mantén tu kit listo
            para cada cliente.
          </p>
        </div>

        <button className="primary-button" onClick={onStart}>
          <span>Comenzar</span>
          <ArrowRight size={20} strokeWidth={1.8} />
        </button>
      </section>
    </main>
  );
}

export default Welcome;