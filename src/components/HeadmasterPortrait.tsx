import React from 'react';

interface PortraitProps {
  className?: string;
  size?: number | string;
}

export default function HeadmasterPortrait({ className = '', size = 80 }: PortraitProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="প্রধান শিক্ষক জনাব মোঃ জাহাঙ্গীর আলম"
    >
      <defs>
        <clipPath id="headmasterClip">
          <circle cx="100" cy="100" r="96" />
        </clipPath>
        <linearGradient id="hmBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
        <linearGradient id="hmSuit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="hmTie" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>

      {/* Red Circular Outer Rim (matching user photo) */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#d9482b" strokeWidth="4" />

      {/* Clipped Content */}
      <g clipPath="url(#headmasterClip)">
        {/* Neutral Office Background */}
        <rect width="200" height="200" fill="url(#hmBg)" />
        <rect x="130" y="20" width="60" height="100" rx="4" fill="#cbd5e1" opacity="0.6" />
        <rect x="15" y="40" width="30" height="80" rx="4" fill="#94a3b8" opacity="0.4" />

        {/* Shoulders & Dark Suit */}
        <path
          d="M 20 200 C 25 150, 60 142, 100 142 C 140 142, 175 150, 180 200 Z"
          fill="url(#hmSuit)"
        />

        {/* White Dress Shirt V-Neck */}
        <polygon points="78,142 122,142 100,195" fill="#ffffff" />
        <polygon points="85,142 100,152 78,142" fill="#e2e8f0" />
        <polygon points="115,142 100,152 122,142" fill="#e2e8f0" />

        {/* Navy Blue Tie with Stripes */}
        <polygon points="94,152 106,152 110,200 90,200" fill="url(#hmTie)" />
        {/* Tie Stripes */}
        <line x1="93" y1="162" x2="107" y2="167" stroke="#93c5fd" strokeWidth="2" />
        <line x1="92" y1="174" x2="108" y2="179" stroke="#93c5fd" strokeWidth="2" />
        <line x1="91" y1="186" x2="109" y2="191" stroke="#93c5fd" strokeWidth="2" />
        {/* Tie Knot */}
        <polygon points="94,148 106,148 103,156 97,156" fill="#1e3a8a" />

        {/* Neck */}
        <rect x="88" y="115" width="24" height="32" rx="4" fill="#c68a5c" />
        <path d="M 88 126 C 96 135, 104 135, 112 126 Z" fill="#b07346" opacity="0.6" />

        {/* Head & Face Contour */}
        <ellipse cx="100" cy="85" rx="38" ry="44" fill="#d49b6a" />

        {/* Ears */}
        <ellipse cx="62" cy="86" rx="5" ry="10" fill="#c68a5c" />
        <ellipse cx="138" cy="86" rx="5" ry="10" fill="#c68a5c" />

        {/* Black Hair - neat side-combed style */}
        <path
          d="M 64 78 C 62 50, 75 35, 100 35 C 125 35, 138 50, 136 78 C 132 58, 118 48, 100 48 C 82 48, 68 58, 64 78 Z"
          fill="#1c1917"
        />
        <path
          d="M 64 72 C 63 60, 72 45, 95 44 C 118 43, 132 54, 135 70 C 128 55, 114 49, 98 50 C 78 51, 68 62, 64 72 Z"
          fill="#09090b"
        />

        {/* Eyebrows */}
        <path d="M 74 68 Q 85 64 94 67" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 106 67 Q 115 64 126 68" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="84" cy="76" rx="4.5" ry="3" fill="#1c1917" />
        <ellipse cx="116" cy="76" rx="4.5" ry="3" fill="#1c1917" />
        <circle cx="85" cy="75" r="1.2" fill="#ffffff" />
        <circle cx="117" cy="75" r="1.2" fill="#ffffff" />

        {/* Thick Black Rectangular Spectacles (Glasses matching photo) */}
        <rect x="71" y="69" width="25" height="18" rx="4" fill="none" stroke="#111827" strokeWidth="3" />
        <rect x="104" y="69" width="25" height="18" rx="4" fill="none" stroke="#111827" strokeWidth="3" />
        {/* Bridge */}
        <path d="M 96 76 Q 100 74 104 76" stroke="#111827" strokeWidth="3" fill="none" />
        {/* Temples */}
        <line x1="71" y1="74" x2="62" y2="76" stroke="#111827" strokeWidth="2.5" />
        <line x1="129" y1="74" x2="138" y2="76" stroke="#111827" strokeWidth="2.5" />
        {/* Glass reflection */}
        <line x1="75" y1="72" x2="88" y2="83" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="108" y1="72" x2="121" y2="83" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.5" />

        {/* Nose */}
        <path d="M 100 78 L 98 94 L 104 94" stroke="#b07346" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Mustache & Goatee Beard (matching photo) */}
        {/* Mustache */}
        <path d="M 88 103 Q 100 102 112 103" stroke="#27272a" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Gentle Mouth Smile */}
        <path d="M 90 106 Q 100 113 110 106" stroke="#883b27" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Chin Goatee */}
        <path
          d="M 88 112 Q 100 125 112 112 C 114 116, 110 124, 100 126 C 90 124, 86 116, 88 112 Z"
          fill="#18181b"
        />
        {/* Jawline Trim Beard */}
        <path
          d="M 68 96 Q 78 122 100 127 Q 122 122 132 96 C 130 118, 118 126, 100 129 C 82 126, 70 118, 68 96 Z"
          fill="#27272a"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
