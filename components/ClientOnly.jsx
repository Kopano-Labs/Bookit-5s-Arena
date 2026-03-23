'use client';
import dynamic from 'next/dynamic';

const Analytics = dynamic(() => import('./Analytics'), { ssr: false });

export default function ClientOnly() {
  return (
    <>
      <Analytics />
    </>
  );
}
