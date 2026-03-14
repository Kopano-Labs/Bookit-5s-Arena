'use client';
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });
const Analytics = dynamic(() => import('./Analytics'), { ssr: false });

export default function ClientOnly() {
  return (
    <>
      <ChatWidget />
      <Analytics />
    </>
  );
}
