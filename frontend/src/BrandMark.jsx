import React from 'react';

// Selo circular com formas geométricas — assinatura visual do Tutor BNCC.
// size em px; variant controla a paleta.
function BrandMark({ size = 44, variant = 'slate' }) {
  const bg = variant === 'chalk' ? 'var(--chalk)' : 'var(--slate)';
  const fg = '#faf7f0';

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(43,43,46,0.18)',
      }}
      aria-hidden="true"
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        {/* Triângulo */}
        <path d="M5 19L9 7L13 19H5Z" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
        {/* Círculo */}
        <circle cx="17.5" cy="9" r="3" stroke={fg} strokeWidth="1.6" />
        {/* Pequeno quadrado */}
        <rect x="14.5" y="16" width="5" height="5" rx="0.8" stroke={fg} strokeWidth="1.6" />
      </svg>
    </div>
  );
}

export default BrandMark;
