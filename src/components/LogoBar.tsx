'use client';

import { useState } from 'react';

const LogoBar = () => {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);
  
  // Array of logos to display
  const logos = [
    { src: '/CTD.png', alt: 'CTD Logo', tooltip: 'We are seeking a grant from the CTD Foundation' },
    { src: '/tut.jpg', alt: 'TUT Logo', tooltip: 'We are seeking a grant from the TUT Foundation', isCircle: true },
    { src: '/bub.jpg', alt: 'BUB Art Collective', tooltip: 'We are seeking artistic collaborations for our platform', isCircle: true },
  ];
  
  return (
    <div className="w-full bg-white py-3 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-8">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="relative"
              onMouseEnter={() => logo.tooltip ? setActiveTooltipIndex(index) : setActiveTooltipIndex(null)}
              onMouseLeave={() => setActiveTooltipIndex(null)}
            >
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className={`h-8 w-8 cursor-pointer transition-transform hover:scale-110 object-cover ${logo.isCircle ? 'rounded-full' : ''}`} 
              />
              
              {/* Tooltip that appears on hover */}
              {activeTooltipIndex === index && logo.tooltip && (
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 bg-white text-gray-800 text-xs rounded-lg py-2 px-3 shadow-lg z-10">
                  <div className="relative">
                    {logo.tooltip}
                    {/* Arrow pointing down */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-white rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoBar;
