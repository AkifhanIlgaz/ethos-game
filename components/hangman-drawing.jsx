import React from "react";

const partProps = [
  // Kafa
  {
    element: (
      <circle
        cx="140"
        cy="70"
        r="20"
        stroke="black"
        strokeWidth="4"
        fill="none"
      />
    ),
    length: 2 * Math.PI * 20, // Dairenin çevresi
  },
  // Gövde
  {
    element: (
      <line x1="140" y1="90" x2="140" y2="150" stroke="black" strokeWidth="4" />
    ),
    length: 60,
  },
  // Sol kol
  {
    element: (
      <line
        x1="140"
        y1="110"
        x2="110"
        y2="130"
        stroke="black"
        strokeWidth="4"
      />
    ),
    length: Math.sqrt(30 * 30 + 20 * 20),
  },
  // Sağ kol
  {
    element: (
      <line
        x1="140"
        y1="110"
        x2="170"
        y2="130"
        stroke="black"
        strokeWidth="4"
      />
    ),
    length: Math.sqrt(30 * 30 + 20 * 20),
  },
  // Sol bacak
  {
    element: (
      <line
        x1="140"
        y1="150"
        x2="120"
        y2="190"
        stroke="black"
        strokeWidth="4"
      />
    ),
    length: Math.sqrt(20 * 20 + 40 * 40),
  },
  // Sağ bacak
  {
    element: (
      <line
        x1="140"
        y1="150"
        x2="160"
        y2="190"
        stroke="black"
        strokeWidth="4"
      />
    ),
    length: Math.sqrt(20 * 20 + 40 * 40),
  },
];

export default function HangmanDrawing({ step = 0 }) {
  return (
    <svg
      width="200"
      height="250"
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* Stand */}
      <line x1="20" y1="230" x2="180" y2="230" stroke="#444" strokeWidth="6" />
      <line x1="60" y1="230" x2="60" y2="30" stroke="#444" strokeWidth="6" />
      <line x1="60" y1="30" x2="140" y2="30" stroke="#444" strokeWidth="6" />
      <line x1="140" y1="30" x2="140" y2="50" stroke="#444" strokeWidth="6" />
      {/* Adam parçaları */}
      {partProps.slice(0, step).map((part, i) => (
        <g key={i}>
          {React.cloneElement(part.element, {
            style: {
              strokeDasharray: part.length,
              strokeDashoffset: part.length,
              animation: `draw 0.5s linear forwards`,
              animationDelay: `${i * 0.01}s`,
            },
          })}
        </g>
      ))}
      <style>
        {`
          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </svg>
  );
}
