'use client';

import { useState, useEffect } from 'react';
import { FaFutbol } from 'react-icons/fa';

const BookNowFloat = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Show after scrolling 300px
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToCourts = () => {
    const el = document.getElementById('courts');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.location.href = '/#courts';
  };

  return (
    <button
      onClick={scrollToCourts}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Book a court"
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: `translateY(-50%) translateX(${visible ? '0' : '110px'})`,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '18px 10px',
        background: hovered ? '#16a34a' : '#15803d',
        borderRadius: '12px 0 0 12px',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease',
        boxShadow: hovered
          ? '-4px 0 30px rgba(34,197,94,0.7), -2px 0 10px rgba(0,0,0,0.4)'
          : '-4px 0 20px rgba(34,197,94,0.4), -2px 0 8px rgba(0,0,0,0.3)',
        animation: visible ? 'none' : undefined,
      }}
    >
      <FaFutbol
        style={{
          color: '#fff',
          fontSize: '20px',
          transform: hovered ? 'rotate(20deg) scale(1.2)' : 'rotate(0deg) scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      {'BOOK NOW'.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            color: '#fff',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Impact, Arial Black, sans-serif',
            lineHeight: 1,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </button>
  );
};

export default BookNowFloat;
