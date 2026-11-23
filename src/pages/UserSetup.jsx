import AccessButton from "../components/AccessButton";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

function UserSetup({ onContinue }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) return;

    onContinue(cleanName);
  };

  return (
    <main className="user-setup-page">
      <section className="user-setup-card">
        <div className="setup-brand user-brand">
          <span className="setup-brand-mark">✦</span>
          <span>Maybelline Pro Stock Predictor</span>
        </div>

        <p className="user-setup-eyebrow">
          ANTES DE EMPEZAR
        </p>

        <h1>
          ¿Cómo te
          <br />
          llamas?
        </h1>

        <p className="user-setup-description">
          Queremos personalizar tu experiencia y ayudarte
          a mantener tu kit siempre listo.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Tu nombre
          </label>

          <input
            id="name"
            type="text"
            placeholder="Ej. Valentina"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />

          <AccessButton screen="user-setup" action="saveName"
            type="submit"
            className="user-setup-button"
            disabled={!name.trim()}
          >
            Continuar
            <ArrowRight size={18} />
          </AccessButton>
        </form>
      </section>
    </main>
  );
}

export default UserSetup;