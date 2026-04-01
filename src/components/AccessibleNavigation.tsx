/**
 * Accessible Navigation Component
 *
 * Enhanced version of Navigation.tsx with improved keyboard accessibility:
 * - Proper ARIA attributes
 * - Keyboard event handlers
 * - Focus management for mobile menu
 * - Escape key support
 *
 * Replace the existing Navigation.tsx with this version
 */

import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { isEscapeKey } from '../utils/keyboardHelpers';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function AccessibleNavigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'education', label: 'How-To Guide' },
    { id: 'our-journey', label: 'Our Journey' },
    { id: 'hall-of-fame', label: 'Hall of Fame' },
    { id: 'submit', label: 'Submit Video' },
  ];

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isEscapeKey(e) && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus first menu item when opened
      const firstMenuItem = mobileMenuRef.current?.querySelector('button');
      firstMenuItem?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavigation('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            aria-label="Triple Waza Challenge - Go to home page"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl" aria-hidden="true">🥋</span>
              <span className="font-bold text-lg">OSP Logo</span>
              <span className="text-2xl" aria-hidden="true">🥋</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">Triple Waza Challenge</span>
              <span className="text-xs text-slate-300">Hall of Fame</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8" role="menubar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-200 hover:text-white'
                }`}
                role="menuitem"
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="md:hidden"
            onClick={handleMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className="md:hidden pb-4"
            role="menu"
            aria-label="Mobile navigation"
          >
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`block w-full text-left py-2 px-4 ${
                  currentPage === item.id
                    ? 'bg-slate-700 text-blue-400 font-semibold'
                    : 'text-slate-200 hover:bg-slate-700'
                }`}
                role="menuitem"
                aria-current={currentPage === item.id ? 'page' : undefined}
                tabIndex={0}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
