import React from 'react';

interface PortraitProps {
  className?: string;
  size?: number | string;
}

export default function PresidentPortrait({ className = '', size = 80 }: PortraitProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="অধ্যক্ষ জনাব মোঃ আবদুল কাদের"
    >
      <defs>
        <clipPath id="presidentClip">
          <circle cx="100" cy="100" r="96" />
        </clipPath>
        <linearGradient id="presBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="greenKurta" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#65a30d" />
          <stop offset="50%" stopColor="#4d7c0f" />
          <stop offset="100%" stopColor="#3f6212" />
        </linearGradient>
      </defs>

      {/* Gold & Blue Circular Rim */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#f59e0b" strokeWidth="3" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#0c3664" strokeWidth="1.5" />

      {/* Clipped Content */}
      <g clipPath="url(#presidentClip)">
        {/* Soft Academic Background with Seminar Banner hint */}
        <rect width="200" height="200" fill="url(#presBg)" />
        {/* Background Banner details matching photo */}
        <rect x="25" y="15" width="150" height="55" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" opacity="0.8" />
        <path d="M 85 20 Q 100 28 115 20 L 115 32 Q 100 40 85 32 Z" fill="#b91c1c" opacity="0.7" />
        <line x1="45" y1="42" x2="155" y2="42" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />
        <line x1="55" y1="52" x2="145" y2="52" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" opacity="0.4" />

        {/* Shoulders & Olive-Green Printed Kurta / Punjabi */}
        <path
          d="M 15 200 C 22 150, 58 140, 100 140 C 142 140, 178 150, 185 200 Z"
          fill="url(#greenKurta)"
        />

        {/* Kurta Collar & Placket */}
        <path
          d="M 86 138 Q 100 146 114 138 L 112 148 Q 100 154 88 148 Z"
          fill="#365314"
        />
        <rect x="96" y="146" width="8" height="54" fill="#365314" />
        {/* Buttons on Placket */}
        <circle cx="100" cy="156" r="1.5" fill="#fef08a" />
        <circle cx="100" cy="170" r="1.5" fill="#fef08a" />
        <circle cx="100" cy="184" r="1.5" fill="#fef08a" />
        {/* Subtle Kurta Print Pattern Motifs (matching user photo) */}
        <circle cx="65" cy="170" r="3" fill="#84cc16" opacity="0.4" />
        <circle cx="78" cy="188" r="3" fill="#84cc16" opacity="0.4" />
        <circle cx="135" cy="170" r="3" fill="#84cc16" opacity="0.4" />
        <circle cx="122" cy="188" r="3" fill="#84cc16" opacity="0.4" />
        <circle cx="50" cy="190" r="2.5" fill="#84cc16" opacity="0.3" />
        <circle cx="150" cy="190" r="2.5" fill="#84cc16" opacity="0.3" />

        {/* Neck */}
        <rect x="88" y="112" width="24" height="30" rx="3" fill="#cf9b74" />
        <path d="M 88 124 C 96 132, 104 132, 112 124 Z" fill="#b8835b" opacity="0.6" />

        {/* Head & Face Contour */}
        <ellipse cx="100" cy="85" rx="36" ry="42" fill="#d9a57e" />

        {/* Ears */}
        <ellipse cx="64" cy="86" rx="5" ry="11" fill="#cf9b74" />
        <ellipse cx="136" cy="86" rx="5" ry="11" fill="#cf9b74" />

        {/* Hair - Senior Receding Hairline & Grey/Dark tones */}
        <path
          d="M 66 84 C 64 56, 74 38, 100 38 C 126 38, 136 56, 134 84 C 130 68, 120 56, 100 56 C 80 56, 70 68, 66 84 Z"
          fill="#44403c"
        />
        {/* High Forehead / Receding Temples */}
        <path
          d="M 68 80 C 66 65, 72 52, 85 50 C 95 62, 105 62, 115 50 C 128 52, 134 65, 132 80 C 128 66, 116 58, 100 60 C 84 58, 72 66, 68 80 Z"
          fill="#57534e"
        />
        {/* Grey Highlights */}
        <path d="M 68 80 Q 72 68 80 62" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 132 80 Q 128 68 120 62" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Eyebrows */}
        <path d="M 76 68 Q 85 66 93 68" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 107 68 Q 115 66 124 68" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="85" cy="76" rx="4" ry="2.8" fill="#292524" />
        <ellipse cx="115" cy="76" rx="4" ry="2.8" fill="#292524" />
        <circle cx="86" cy="75" r="1" fill="#ffffff" />
        <circle cx="116" cy="75" r="1" fill="#ffffff" />

        {/* Spectacles (Fine Framed Glasses matching photo) */}
        <rect x="73" y="70" width="24" height="15" rx="3" fill="none" stroke="#78716c" strokeWidth="2" />
        <rect x="103" y="70" width="24" height="15" rx="3" fill="none" stroke="#78716c" strokeWidth="2" />
        {/* Glasses Bridge */}
        <path d="M 97 76 Q 100 74 103 76" stroke="#78716c" strokeWidth="2" fill="none" />
        {/* Glasses Temples */}
        <line x1="73" y1="74" x2="64" y2="76" stroke="#78716c" strokeWidth="1.8" />
        <line x1="127" y1="74" x2="136" y2="76" stroke="#78716c" strokeWidth="1.8" />
        {/* Lens sheen */}
        <line x1="77" y1="72" x2="89" y2="82" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="107" y1="72" x2="119" y2="82" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />

        {/* Character Lines / Forehead Creases */}
        <path d="M 84 56 Q 100 54 116 56" stroke="#b8835b" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M 88 60 Q 100 58 112 60" stroke="#b8835b" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Nose */}
        <path d="M 100 77 L 98 94 L 104 94" stroke="#b8835b" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Smile / Mouth */}
        <path d="M 91 106 Q 100 112 109 106" stroke="#883b27" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Smile Laugh Lines */}
        <path d="M 77 96 Q 80 106 86 110" stroke="#b8835b" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M 123 96 Q 120 106 114 110" stroke="#b8835b" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}
