"use client";

import { useState } from "react";

export default function SharedButton({
  onClick,
  children,
  isOfflineSync = false,
  queuedLabel = "Saved to Queue",
  resetQueuedAfterMs = 0,
  disabled,
  style,
  ...props
}) {
  const [isQueued, setIsQueued] = useState(false);

  const handleClick = async (event) => {
    if (isQueued || disabled) return;

    const offline = typeof navigator !== "undefined" && !navigator.onLine;

    if (isOfflineSync && offline) {
      setIsQueued(true);
    }

    if (onClick) {
      await onClick(event);
    }

    if (isOfflineSync && offline && resetQueuedAfterMs > 0) {
      window.setTimeout(() => setIsQueued(false), resetQueuedAfterMs);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isQueued || disabled}
      style={{
        padding: "10px 16px",
        backgroundColor: isQueued ? "#52525b" : "#111827",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: "6px",
        cursor: isQueued || disabled ? "not-allowed" : "pointer",
        fontWeight: 800,
        ...style,
      }}
      {...props}
    >
      {isQueued ? queuedLabel : children}
    </button>
  );
}
