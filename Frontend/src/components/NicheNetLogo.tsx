import React from "react";

const NicheNetLogo = ({ width = 40, height = 40 }) => (
  <div
    style={{ width: `${width}px`, height: `${height}px` }}
    dangerouslySetInnerHTML={{
      __html: `<svg width="${width}" height="${height}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="#6A11CB"/>
            <stop offset="100%" stop-color="#2575FC"/>
          </radialGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle cx="100" cy="100" r="70" fill="url(#grad2)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.7;0.9" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="100" cy="100" r="45" fill="none" stroke="white" stroke-width="2" stroke-dasharray="4,4" opacity="0.7">
          <animate attributeName="r" values="45;50;45" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="100" cy="100" r="30" fill="none" stroke="white" stroke-width="3" opacity="0.8">
          <animate attributeName="r" values="30;35;30" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="100" cy="60" r="8" fill="white"/>
        <circle cx="140" cy="80" r="8" fill="white"/>
        <circle cx="130" cy="130" r="8" fill="white"/>
        <circle cx="70" cy="130" r="8" fill="white"/>
        <circle cx="60" cy="80" r="8" fill="white"/>
        
        <g filter="url(#glow)">
          <line x1="100" y1="60" x2="140" y2="80" stroke="white" stroke-width="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0s"/>
          </line>
          <line x1="140" y1="80" x2="130" y2="130" stroke="white" stroke-width="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.2s"/>
          </line>
          <line x1="130" y1="130" x2="70" y2="130" stroke="white" stroke-width="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.4s"/>
          </line>
          <line x1="70" y1="130" x2="60" y2="80" stroke="white" stroke-width="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.6s"/>
          </line>
          <line x1="60" y1="80" x2="100" y2="60" stroke="white" stroke-width="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.8s"/>
          </line>
          <line x1="100" y1="100" x2="100" y2="60" stroke="white" stroke-width="2" stroke-dasharray="5,2">
            <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" begin="0s"/>
          </line>
        </g>
        
        <circle cx="100" cy="100" r="12" fill="white">
          <animate attributeName="r" values="12;14;12" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>`,
    }}
  />
);

export default NicheNetLogo;