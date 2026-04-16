import { Menu, X, ChevronDown, Search, Trophy, Users, Video, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  dropdown?: Array<{ id: string; label: string; description?: string }>;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'about',
      label: 'About Us',
      dropdown: [
        { id: 'challenge', label: 'The Challenge', description: 'Join the global challenge' },
        { id: 'featured-dojos', label: 'Featured Dojos', description: 'Celebrating excellence worldwide' },
        { id: 'founders', label: 'TWFC Ambassadors', description: 'TWFC Ambassadors' },
      ],
    },
    {
      id: 'challenge',
      label: 'Challenge other Dojos!',
      dropdown: [
        { id: 'challenge-friend', label: 'Challenge a Friend', description: 'Invite friends to participate' },
        { id: 'safety', label: 'Safety Guidelines', description: 'Practice safely and responsibly' },
      ],
    },
    {
      id: 'education',
      label: 'Education',
      dropdown: [
        { id: 'triple-waza-drill', label: 'The Triple Waza Drill', description: 'Master fundamental techniques' },
        { id: 'name-game', label: 'Name That Technique Game', description: 'Test your Judo knowledge' },
      ],
    },
    {
      id: 'hall-of-fame',
      label: 'Hall of Fame',
      dropdown: [
        { id: 'hall-of-fame', label: 'Hall of Fame', description: 'View featured submissions' },
        { id: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg fixed top-0 w-full z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 group"
            aria-label="Triple Waza Challenge - Go to home page"
          >
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white">Triple Waza Challenge</span>
              <span className="text-xs text-slate-400">Global Judo Initiative</span>
            </div>
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => item.dropdown && handleNavClick(item.dropdown[0].id)}
                      className={`px-3 py-2 transition-all duration-200 font-medium flex items-center space-x-1 text-slate-300 hover:text-white ${
                        activeDropdown === item.id || (item.dropdown.some(d => d.id === currentPage))
                          ? 'text-white'
                          : ''
                      }`}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === item.id && (
                      <div className="absolute top-full left-0 pt-2 w-64">
                        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 animate-fade-in-up">
                          {item.dropdown.map((dropdownItem) => (
                            <button
                              key={dropdownItem.id}
                              onClick={() => handleNavClick(dropdownItem.id)}
                              className={`block w-full text-left px-4 py-3 transition-colors duration-200 ${
                                currentPage === dropdownItem.id
                                  ? 'bg-slate-700 border-l-4 border-red-500'
                                  : 'hover:bg-slate-700'
                              }`}
                            >
                              <div className="font-semibold text-white">{dropdownItem.label}</div>
                              {dropdownItem.description && (
                                <div className="text-sm text-slate-400 mt-1">{dropdownItem.description}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 transition-all duration-200 font-medium flex items-center space-x-1 ${
                      currentPage === item.id
                        ? 'text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => handleNavClick('video-submit')}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
            >
              Submit Video
            </button>
          </div>

          <button
            className="md:hidden hover:bg-osp-navy p-2 rounded-md transition-colors duration-200 text-osp-gray hover:text-osp-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {searchOpen && (
          <div className="hidden md:block pb-4 animate-fade-in-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Search dojos, videos, or content..."
                className="w-full px-4 py-2 pl-10 rounded-md bg-osp-navy border border-osp-blue text-osp-white placeholder-osp-gray focus:outline-none focus:border-osp-light-blue transition-colors duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-osp-gray" size={18} />
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => {
                        if (activeDropdown === item.id) {
                          setActiveDropdown(null);
                        } else {
                          setActiveDropdown(item.id);
                          if (item.dropdown) {
                            handleNavClick(item.dropdown[0].id);
                          }
                        }
                      }}
                      className="flex items-center justify-between w-full text-left py-2 px-4 my-1 rounded-md transition-all duration-200 font-medium text-osp-gray hover:bg-osp-navy hover:text-osp-white"
                    >
                      <span className="flex items-center space-x-2">
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.label}</span>
                      </span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === item.id && (
                      <div className="ml-4 space-y-1 animate-fade-in-up">
                        {item.dropdown.map((dropdownItem) => (
                          <button
                            key={dropdownItem.id}
                            onClick={() => handleNavClick(dropdownItem.id)}
                            className={`block w-full text-left py-2 px-4 rounded-md transition-all duration-200 ${
                              currentPage === dropdownItem.id
                                ? 'bg-osp-navy text-osp-white'
                                : 'text-osp-gray hover:bg-osp-navy hover:text-osp-white'
                            }`}
                          >
                            {dropdownItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left py-2 px-4 my-1 rounded-md transition-all duration-200 font-medium ${
                      currentPage === item.id
                        ? 'bg-osp-navy text-osp-white'
                        : 'text-osp-gray hover:bg-osp-navy hover:text-osp-white'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
