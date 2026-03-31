import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { translations } from '../../translations';
import NewsletterForm from '../ui/NewsletterForm';

interface FooterProps {
  lang: 'pt' | 'en';
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const safe = (translations[lang as keyof typeof translations] as any) ?? translations.pt;
  const t = safe.footer;
  const tn = safe.nav;

  return (
    <footer className="bg-surface pt-16 pb-8 md:pb-6 border-t border-border-subtle relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-moz-green via-moz-yellow to-moz-red opacity-40 shadow-sm" aria-hidden="true" />
      
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 mb-12">
          <div className="md:col-span-12 lg:col-span-5">
            <Link to="/" className="flex items-center gap-4 mb-6 group w-fit">
              <div className="w-10 h-10 bg-primary shrink-0 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-primary-glow group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" aria-hidden="true">L</div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-black tracking-tighter text-text-main leading-[0.8] uppercase italic">Locais de Moz</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary mt-1">Digital Gastronomy</span>
              </div>
            </Link>
            <p className="text-text-main text-lg md:text-xl leading-[1.1] max-w-lg font-display italic font-black uppercase tracking-tighter mb-6 mix-blend-difference opacity-80">
              "{t.desc}"
            </p>
            
            <div className="flex gap-4">
                {[
                  { name: 'Instagram', href: 'https://instagram.com/locaisdemoz', icon: Instagram },
                  { name: 'Facebook', href: 'https://facebook.com/locaisdemoz', icon: Facebook },
                  { name: 'X', href: 'https://twitter.com/locaisdemoz', icon: Twitter },
                ].map(social => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={lang === 'pt' ? `Visitar ${social.name}` : `Visit ${social.name}`}
                      className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-primary-glow group"
                    >
                        <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                    </a>
                ))}
            </div>
          </div>
          
          <div className="md:col-span-6 lg:col-span-2 lg:col-start-7">
            <h5 className="font-black mb-4 text-[10px] uppercase tracking-[0.3em] text-primary italic">{t.platform}</h5>
            <nav aria-label="Links do rodapé">
              <div className="flex flex-col gap-3 text-sm font-display font-black italic uppercase tracking-tighter text-text-main/60">
                <Link to="/" className="hover:text-primary hover:translate-x-2 transition-all duration-300">{tn.home}</Link>
                <Link to="/restaurantes" className="hover:text-primary hover:translate-x-2 transition-all duration-300">{lang === 'pt' ? 'Restaurantes' : 'Restaurants'}</Link>
                <Link to="/sobre" className="hover:text-primary hover:translate-x-2 transition-all duration-300">{tn.about}</Link>
                <Link to="/blog" className="hover:text-primary hover:translate-x-2 transition-all duration-300">{tn.sabor}</Link>
              </div>
            </nav>
          </div>

          <div className="md:col-span-6 lg:col-span-4 lg:col-start-9">
             <h5 className="font-black mb-4 text-[10px] uppercase tracking-[0.3em] text-primary italic">{lang === 'pt' ? 'Sabor na Inbox' : 'Flavor in Inbox'}</h5>
             <p className="text-text-dim text-sm mb-4 font-bold italic uppercase tracking-tight opacity-70 leading-relaxed">
                {lang === 'pt' 
                  ? 'Receba o melhor da gastronomia nacional. Sem spam, apenas sabor.' 
                  : 'Receive the best of national gastronomy. No spam, just flavor.'}
             </p>
             <div className="max-w-sm">
                <NewsletterForm lang={lang} />
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/40 italic">
          <p>© {new Date().getFullYear()} Locais de Moz — Curadoria Digital Moçambique.</p>
          <nav aria-label="Links legais">
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <Link to="/privacidade" className="hover:text-primary hover:scale-110 transition-all">{lang === 'pt' ? 'Privacidade' : 'Privacy'}</Link>
              <Link to="/termos" className="hover:text-primary hover:scale-110 transition-all">{lang === 'pt' ? 'Termos' : 'Terms'}</Link>
              <a href="mailto:contacto@locaisdemoz.co.mz" className="hover:text-primary hover:scale-110 transition-all">{lang === 'pt' ? 'Parcerias' : 'Partnerships'}</a>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Decorative Brand Accent */}
      <div className="absolute bottom-[-5%] right-[-5%] text-[10rem] font-black italic uppercase tracking-tighter opacity-[0.02] pointer-events-none select-none uppercase leading-none">
        MOZ
      </div>
    </footer>
  );
};

export default Footer;
