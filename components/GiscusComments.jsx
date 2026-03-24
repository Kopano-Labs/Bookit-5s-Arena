'use client';

import { useEffect, useRef } from 'react';

export default function GiscusComments() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'KholofeloRobynRababalela/bookit-5s-arena'); // Update with actual repo
    script.setAttribute('data-repo-id', 'R_YOUR_REPO_ID'); 
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_YOUR_CATEGORY_ID');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'transparent_dark');
    script.setAttribute('data-lang', 'en');
    script.crossOrigin = 'anonymous';
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6 border-b border-gray-800 pb-3" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
        Fan <span className="text-green-400">Zone</span>
      </h3>
      <div ref={ref} className="giscus-frame-container min-h-[250px]" />
    </div>
  );
}
