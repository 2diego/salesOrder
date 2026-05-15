/** Icono de carrito usado en el header del portal cliente (p. ej. Cart). */
export function CartHeaderIcon() {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 3h2.4l1.8 9.6a2 2 0 0 0 2 1.6h7.4a1.6 1.6 0 0 0 1.6-1.2L21 6H6.8"
        stroke="#000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.5" cy="19" r="1.4" stroke="#000" strokeWidth="1.2" fill="none" />
      <circle cx="18.5" cy="19" r="1.4" stroke="#000" strokeWidth="1.2" fill="none" />
      <line x1="10.5" y1="17.6" x2="10.5" y2="14.2" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10.5" y1="17.6" x2="18.5" y2="17.6" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
