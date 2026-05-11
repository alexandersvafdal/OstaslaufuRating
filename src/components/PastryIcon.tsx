export function PastryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pastry-dough" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="pastry-knot" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <radialGradient id="pastry-cheese">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fbbf24" />
        </radialGradient>
      </defs>
      <g stroke="#7c2d12" strokeLinejoin="round">
        <ellipse
          cx="20"
          cy="32"
          rx="13.5"
          ry="11"
          transform="rotate(-12 20 32)"
          fill="url(#pastry-dough)"
          strokeWidth="1.3"
        />
        <ellipse
          cx="44"
          cy="32"
          rx="13.5"
          ry="11"
          transform="rotate(12 44 32)"
          fill="url(#pastry-dough)"
          strokeWidth="1.3"
        />
        <path
          d="M27 21 Q32 28 37 21 Q34 32 37 43 Q32 36 27 43 Q30 32 27 21 Z"
          fill="url(#pastry-knot)"
          strokeWidth="1.2"
        />
      </g>
      <ellipse
        cx="18"
        cy="31"
        rx="6"
        ry="4"
        transform="rotate(-12 18 31)"
        fill="url(#pastry-cheese)"
        opacity="0.92"
      />
      <ellipse
        cx="46"
        cy="33"
        rx="6"
        ry="4"
        transform="rotate(12 46 33)"
        fill="url(#pastry-cheese)"
        opacity="0.92"
      />
      <g fill="#1c1917">
        <circle cx="10" cy="29" r="1" />
        <circle cx="12" cy="37" r="1" />
        <circle cx="15" cy="23" r="1" />
        <circle cx="14" cy="41" r="1" />
        <circle cx="23" cy="21" r="1" />
        <circle cx="25" cy="41" r="1" />
        <circle cx="54" cy="29" r="1" />
        <circle cx="52" cy="37" r="1" />
        <circle cx="49" cy="23" r="1" />
        <circle cx="50" cy="41" r="1" />
        <circle cx="41" cy="21" r="1" />
        <circle cx="39" cy="41" r="1" />
        <circle cx="32" cy="19" r="1" />
        <circle cx="32" cy="45" r="1" />
      </g>
    </svg>
  );
}
