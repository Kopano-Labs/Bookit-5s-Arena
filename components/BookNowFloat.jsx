'use client';

import { useState, useEffect } from 'react';
import { FaFutbol } from 'react-icons/fa';

const BookNowFloat = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Appear after scrolling 300px
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
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: `translateY(-50%) translateX(${visible ? '0' : '120px'})`,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 9999,
      }}
    >
      <button
        onClick={scrollToCourts}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Book a court"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: hovered ? '10px' : '0px',
          padding: hovered ? '13px 18px 13px 14px' : '13px 12px',
          width: hovered ? 'auto' : '48px',
          overflow: 'hidden',
          background: hovered ? '#16a34a' : '#15803d',
          borderRadius: '10px 0 0 10px',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: hovered
            ? '-4px 0 30px rgba(34,197,94,0.8), -2px 0 12px rgba(0,0,0,0.4)'
            : '-3px 0 16px rgba(34,197,94,0.45)',
          whiteSpace: 'nowrap',
        }}
      >
        <FaFutbol
          style={{
            color: '#fff',
            fontSize: '22px',
            flexShrink: 0,
            transform: hovered ? 'rotate(20deg) scale(1.15)' : 'rotate(0deg) scale(1)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        <span
          style={{
            color: '#fff',
            fontSize: '13px',
            fontWeight: 900,
            fontFamily: 'Impact, Arial Black, sans-serif',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: hovered ? 1 : 0,
            maxWidth: hovered ? '120px' : '0px',
            transition: 'opacity 0.2s ease 0.05s, max-width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          BOOK NOW
        </span>
      </button>
    </div>
  );
};

export default BookNowFloat;
