import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

interface FooterProps {
  lang: 'pt' | 'en';
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { to: '/', label: lang === 'pt' ? 'Início' : 'Home' },
    { to: '/restaurantes', label: lang === 'pt' ? 'Restaurantes' : 'Restaurants' },
    { to: '/sobre', label: lang === 'pt' ? 'Sobre Nós' : 'About Us' },
    { to: '/blog', label: lang === 'pt' ? 'O Sabor' : 'Flavor' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/locaisdemoz', icon: Instagram },
    { name: 'Facebook', href: 'https://facebook.com/locaisdemoz', icon: Facebook },
    { name: 'X', href: 'https://twitter.com/locaisdemoz', icon: Twitter },
  ];

  return (
    <footer className="bg-[#1a1a1a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <span className="text-white font-semibold text-lg">Locais de Moz</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              {lang === 'pt' 
                ? 'Menus digitais e experiências gastronómicas em Moçambique.' 
                : 'Digital menus and gastronomic experiences in Mozambique.'}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === 'pt' ? `Visitar ${social.name}` : `Visit ${social.name}`}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <h5 className="text-white font-medium text-sm mb-4">
              {lang === 'pt' ? 'Navegação' : 'Navigation'}
            </h5>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-400 text-sm hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-1">
            <h5 className="text-white font-medium text-sm mb-4">
              {lang === 'pt' ? 'Stay Updated' : 'Stay Updated'}
            </h5>
            <p className="text-gray-400 text-sm mb-4">
              {lang === 'pt' 
                ? 'Receba novidades gastronómicas sem spam.' 
                : 'Receive gastronomic news without spam.'}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={lang === 'pt' ? 'O seu email' : 'Your email'}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {lang === 'pt' ? 'OK' : 'OK'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} MenusMoz. {lang === 'pt' ? 'Curadoria Digital Moçambique.' : 'Digital Curator Mozambique.'}
          </p>
          <nav className="flex gap-6">
            <Link to="/privacidade" className="text-gray-500 text-xs hover:text-white transition-colors">
              {lang === 'pt' ? 'Privacidade' : 'Privacy'}
            </Link>
            <Link to="/termos" className="text-gray-500 text-xs hover:text-white transition-colors">
              {lang === 'pt' ? 'Termos' : 'Terms'}
            </Link>
            <a href="mailto:contacto@locaisdemoz.co.mz" className="text-gray-500 text-xs hover:text-white transition-colors">
              {lang === 'pt' ? 'Parcerias' : 'Partnerships'}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;