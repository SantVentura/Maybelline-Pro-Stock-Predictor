import { useRef, useState } from "react";
import { CheckCircle2, MoveRight, Puzzle } from "lucide-react";
import "./SlidePuzzleCaptcha.css";
import { clampPuzzleOffset, isPuzzleComplete } from "../data/slidePuzzle.js";

/**
 * Desafío visual para la demostración: NO ES un CAPTCHA de seguridad real.
 * El usuario debe llevar la pieza al hueco; no hay claves, redes ni servicios externos.
 */
export default function SlidePuzzleCaptcha({ verified, onVerified }) {
  const trackRef = useRef(null);
  const pieceRef = useRef(null);
  const dragRef = useRef(null);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [percent, setPercent] = useState(0);
  const [dragging, setDragging] = useState(false);

  const maxTravel = () => Math.max(1,
    (trackRef.current?.clientWidth ?? 0) - (pieceRef.current?.offsetWidth ?? 54) - 10
  );
  const setPosition = (value) => {
    const limited = clampPuzzleOffset(value, maxTravel());
    offsetRef.current = limited;
    setOffset(limited);
    setPercent(Math.round((limited / maxTravel()) * 100));
    return limited;
  };
  const finish = (value) => {
    if (isPuzzleComplete(value, maxTravel())) {
      setPosition(maxTravel());
      onVerified?.();
    } else {
      setPosition(0);
    }
  };
  const pointerDown = (event) => {
    if (verified || (event.pointerType === "mouse" && event.button !== 0)) return;
    dragRef.current = { id: event.pointerId, startX: event.clientX, startOffset: offsetRef.current };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };
  const pointerMove = (event) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId || verified) return;
    setPosition(dragRef.current.startOffset + event.clientX - dragRef.current.startX);
  };
  const pointerUp = (event) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
    const next = setPosition(dragRef.current.startOffset + event.clientX - dragRef.current.startX);
    dragRef.current = null;
    setDragging(false);
    finish(next);
  };
  const pointerCancel = (event) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setPosition(0);
  };
  const onKeyDown = (event) => {
    if (verified) return;
    let next;
    if (event.key === "ArrowRight") next = offsetRef.current + maxTravel() / 8;
    else if (event.key === "ArrowLeft") next = offsetRef.current - maxTravel() / 8;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = maxTravel();
    else return;
    event.preventDefault();
    const current = setPosition(next);
    if (isPuzzleComplete(current, maxTravel())) finish(current);
  };

  return (
    <div className={`checkout-captcha ${verified ? "is-verified" : ""}`}>
      <div className="checkout-captcha-heading">
        <div className="checkout-captcha-symbol" aria-hidden="true">
          {verified ? <CheckCircle2 size={20} /> : <Puzzle size={20} />}
        </div>
        <div>
          <strong>{verified ? "¡Rompecabezas completado!" : "Completa el rompecabezas"}</strong>
          <span>{verified ? "Ya puedes confirmar el pedido." : "Arrastra la pieza hasta el espacio de la derecha."}</span>
        </div>
      </div>
      <div ref={trackRef} className="checkout-captcha-track">
        <div className="checkout-captcha-guide" aria-hidden="true"><MoveRight size={20} /></div>
        <span className="checkout-captcha-target" aria-hidden="true"><Puzzle size={25} /></span>
        <button
          ref={pieceRef}
          className={`checkout-captcha-piece ${dragging ? "is-dragging" : ""}`}
          style={{ transform: `translateX(${offset}px)` }}
          type="button"
          role="slider"
          aria-label="Pieza del rompecabezas. Arrastra a la derecha, o usa las flechas del teclado."
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={verified ? 100 : percent}
          aria-valuetext={verified ? "Verificación de demostración completada" : `${percent}% completado`}
          disabled={verified}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerCancel}
          onKeyDown={onKeyDown}
        >
          {verified ? <CheckCircle2 size={26} /> : <Puzzle size={26} />}
        </button>
      </div>
      <p className="checkout-captcha-help" role="status">
        {verified
          ? "Verificación visual completada para esta compra de prueba."
          : "En computador o celular: arrastra la pieza. Con teclado: flecha derecha o Fin."}
      </p>
      <p className="checkout-captcha-disclaimer">
        Verificación visual simulada: no es un CAPTCHA de seguridad real ni protege contra bots.
      </p>
    </div>
  );
}
