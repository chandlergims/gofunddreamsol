'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

const Navbar = () => {
  const { isConnected, address, connectWallet, disconnectWallet, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-2 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <img src="/stars.png" alt="GoFundDream Logo" className="h-8 w-auto" />
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <Link href="/about" className="text-gray-700 hover:text-blue-600 text-[8px] font-press-start-2p transition-colors">
              About
            </Link>
            <a 
              href="https://x.com/GoFundDream" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-700 hover:text-blue-600 text-[8px] font-press-start-2p transition-colors"
            >
              Twitter
            </a>
          </div>
          
          {/* Always show the same button size to prevent layout shift */}
          <div className="relative" ref={dropdownRef}>
            {isConnected ? (
              <button 
                onClick={toggleDropdown}
                className="bg-transparent hover:bg-gray-50 text-gray-700 text-[8px] font-press-start-2p py-2 px-4 rounded-lg transition-colors border border-gray-200 flex items-center min-w-[140px] justify-center"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  <span className="mr-1">
                    {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-transparent hover:bg-gray-50 text-gray-700 text-[8px] font-press-start-2p py-2 px-4 rounded-lg transition-colors border border-gray-200 flex items-center min-w-[140px] justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect Wallet
                  </>
                )}
              </button>
            )}
            
            {/* Dropdown menu */}
            {isConnected && dropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                <button 
                  onClick={() => {
                    disconnectWallet();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[8px] text-gray-700 hover:bg-gray-50 flex items-center font-press-start-2p"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
