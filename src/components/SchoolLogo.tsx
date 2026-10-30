/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export default function SchoolLogo({ className = '', size = 56 }: SchoolLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় মনোগ্রাম"
    >
      {/* Outer Crimson/Red-Orange Border */}
      <circle cx="150" cy="150" r="148" fill="#d9482b" stroke="#99260f" strokeWidth="2" />
      <circle cx="150" cy="150" r="142" fill="#d9482b" />

      {/* Blue Circular Band */}
      <circle cx="150" cy="150" r="138" fill="#0d4177" stroke="#092d53" strokeWidth="1.5" />

      {/* Inner Yellow Disc */}
      <circle cx="150" cy="150" r="92" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5" />

      {/* SVG Arc Paths for Curved Text */}
      <defs>
        {/* Top Text Arc (clockwise) */}
        <path
          id="topTextPath"
          d="M 36,150 A 114,114 0 0,1 264,150"
        />
        {/* Bottom Text Arc (clockwise from bottom-left to bottom-right) */}
        <path
          id="bottomTextPath"
          d="M 44,158 A 110,110 0 0,0 256,158"
        />
        {/* Motto Arc inside yellow circle */}
        <path
          id="mottoPath"
          d="M 72,138 A 78,78 0 0,1 228,138"
        />
      </defs>

      {/* Top Arc Text: নাপোড়া শেখেরখীল উচ্চ বিদ্যালয় */}
      <text fill="#ffffff" fontSize="21.5" fontWeight="700" letterSpacing="0.8">
        <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
          নাপোড়া শেখেরখীল উচ্চ বিদ্যালয়
        </textPath>
      </text>

      {/* Left and Right White Stars */}
      {/* Left Star */}
      <polygon
        points="32,150 36,140 46,140 38,146 41,156 32,150 23,156 26,146 18,140 28,140"
        fill="#ffffff"
        transform="translate(18, 5) scale(0.9)"
      />
      {/* Right Star */}
      <polygon
        points="32,150 36,140 46,140 38,146 41,156 32,150 23,156 26,146 18,140 28,140"
        fill="#ffffff"
        transform="translate(222, 5) scale(0.9)"
      />

      {/* Bottom Arc Text: বাঁশখালী, চট্টগ্রাম */}
      <text fill="#ffffff" fontSize="22" fontWeight="700" letterSpacing="1.2">
        <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
          বাঁশখালী, চট্টগ্রাম
        </textPath>
      </text>

      {/* Inner Elements */}
      {/* 1. Motto Text: পড় স্রষ্টার নামে */}
      <text fill="#831843" fontSize="15" fontWeight="800" letterSpacing="0.5">
        <textPath href="#mottoPath" startOffset="50%" textAnchor="middle">
          পড় স্রষ্টার নামে
        </textPath>
      </text>

      {/* 2. Rising Sun Radiance Rays */}
      <g stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round">
        <line x1="150" y1="92" x2="150" y2="82" />
        <line x1="138" y1="95" x2="134" y2="85" />
        <line x1="162" y1="95" x2="166" y2="85" />
        <line x1="126" y1="100" x2="120" y2="92" />
        <line x1="174" y1="100" x2="180" y2="92" />
        <line x1="116" y1="108" x2="108" y2="102" />
        <line x1="184" y1="108" x2="192" y2="102" />
        <line x1="108" y1="118" x2="99" y2="114" />
        <line x1="192" y1="118" x2="201" y2="114" />
      </g>

      {/* 3. Red Semicircle Rising Sun */}
      <path
        d="M 112,126 A 38,38 0 0,1 188,126 Z"
        fill="#dc2626"
        stroke="#991b1b"
        strokeWidth="1.5"
      />

      {/* 4. Open Book (কিতাব / পুস্তক) */}
      <g>
        {/* Left Page Outer and Fill */}
        <path
          d="M 150,130 C 134,124 104,124 92,128 L 98,174 C 110,170 134,170 150,176 Z"
          fill="#f8fafc"
          stroke="#0f172a"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Right Page Outer and Fill */}
        <path
          d="M 150,130 C 166,124 196,124 208,128 L 202,174 C 190,170 166,170 150,176 Z"
          fill="#f8fafc"
          stroke="#0f172a"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Book Spine Center Line */}
        <line x1="150" y1="130" x2="150" y2="176" stroke="#0f172a" strokeWidth="3" />
        {/* Inner Spine Fold Shadow */}
        <path
          d="M 148,131 C 145,138 145,168 148,175 L 152,175 C 155,168 155,138 152,131 Z"
          fill="#334155"
        />
        {/* Left Page Soft Shadow / Lines */}
        <path
          d="M 104,136 C 116,133 134,133 144,137"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 106,146 C 118,143 134,143 144,147"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right Page Soft Shadow / Lines */}
        <path
          d="M 156,137 C 166,133 184,133 196,136"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 156,147 C 166,143 184,143 194,146"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* 5. Established Year: স্থাপিত : ১৯৬৪ ইং */}
      <text
        x="150"
        y="218"
        fill="#831843"
        fontSize="17.5"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="0.8"
      >
        স্থাপিত : ১৯৬৪ ইং
      </text>
    </svg>
  );
}
