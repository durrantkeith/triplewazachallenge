import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'library-home', label: 'Library Home' },
    { id: 'kata-collections', label: 'Kata Collections' },
    { id: 'hall-of-fame', label: 'Hall of Fame' },
    { id: 'video-submit', label: 'Submit Video' },
    { id: 'education', label: 'How-To Guide' },
  ];

  const resources = [
    { label: 'Judo Techniques', external: true },
    { label: 'Training Tips', external: true },
    { label: 'Safety Guidelines', external: true },
    { label: 'Kata Standards', external: true },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/osp-logo-white-150x150.png"
                alt="Odd Squad Productions Logo"
                className="h-16 w-auto"
              />
              <div>
                <h3 className="font-bold text-xl text-white">Triple Waza</h3>
                <p className="text-sm text-slate-400">Friendship Challenge</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              A global community initiative connecting dojos worldwide through the practice and celebration of traditional Judo techniques.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-blue-400 p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-pink-600 p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-red-600 p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white border-b-2 border-red-600 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors duration-200 text-sm flex items-center space-x-1"
                  >
                    <span>›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white border-b-2 border-blue-600 pb-2 inline-block">
              Resources
            </h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center space-x-2"
                  >
                    <span>›</span>
                    <span>{resource.label}</span>
                    {resource.external && <ExternalLink size={12} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white border-b-2 border-yellow-500 pb-2 inline-block">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm text-slate-300">
                <Mail className="text-red-400 flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-semibold text-white mb-1">Email</p>
                  <a href="mailto:info@triplewaza.org" className="hover:text-red-400 transition-colors duration-200">
                    info@triplewaza.org
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-slate-300">
                <MapPin className="text-blue-400 flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-semibold text-white mb-1">Location</p>
                  <p>Global Initiative</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 border border-white/10 rounded-lg p-3 mt-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Launch Date:</strong>
                  <br />
                  April 28, 2027
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-yellow-400">Unofficial Initiative:</strong> This challenge is not affiliated with, endorsed by, or officially recognized by the International Judo Federation (IJF) or any national judo federation.
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-red-400">Practice Safely:</strong> All participants practice at their own risk. Please train under qualified instruction and follow your dojo's safety guidelines.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">
              © {currentYear} Triple Waza Friendship Challenge. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              A grassroots community initiative to promote friendship, learning, and the preservation of traditional Judo kata.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
