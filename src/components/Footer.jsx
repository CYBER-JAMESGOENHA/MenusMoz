import { Link } from 'react-router-dom';
import { translations } from '../translations';
import NewsletterForm from './NewsletterForm';

const Footer = ({ lang }) => {
  const t = translations[lang].footer;
  const tn = translations[lang].nav;

  return (
    <footer className="bg-surface pt-32 pb-16 md:pb-8 rounded-t-custom-lg transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-moz-green via-moz-yellow to-moz-red opacity-30" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-14 h-14 bg-primary shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-primary-glow group-hover:rotate-12 transition-transform" aria-hidden="true">L</div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-text-main leading-none uppercase">Locais de Moz</span>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-primary mt-1">Digital Gastronomy</span>
              </div>
            </Link>
            <p className="text-text-dim text-2xl leading-relaxed max-w-md italic font-medium">
              "{t.desc}"
            </p>
            
            <div className="flex gap-4 mt-10">
                {[
                  { name: 'Instagram', href: 'https://instagram.com' },
                  { name: 'Facebook', href: 'https://facebook.com' },
                  { name: 'Twitter', href: 'https://twitter.com' },
                ].map(social => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visitar ${social.name}`}
                      className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-2"
                    >
                        <span className="sr-only">{social.name}</span>
                        <div className="w-5 h-5 bg-current opacity-20" aria-hidden="true" />
                    </a>
                ))}
            </div>
          </div>
          
          <div className="md:col-span-2 md:offset-1">
            <h5 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-primary">{t.platform}</h5>
            <nav aria-label="Links do rodapé">
              <div className="flex flex-col gap-5 text-lg font-bold text-text-dim">
                <Link to="/sobre" className="hover:text-primary transition-colors">{tn.about}</Link>
                <Link to="/blog" className="hover:text-primary transition-colors">{tn.sabor}</Link>
                <Link to="/proprietarios" className="hover:text-primary transition-colors">{tn.owners}</Link>
              </div>
            </nav>
          </div>

          <div className="md:col-span-4">
             <h5 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-primary">Sabor na Caixa</h5>
             <p className="text-text-dim mb-6 font-medium">Receba as melhores ofertas e novidades dos restaurantes de Moçambique.</p>
             <NewsletterForm lang={lang} />
          </div>
        </div>

        <div className="border-t border-border-subtle pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-text-dim text-xs font-black uppercase tracking-widest">
          <p>© 2026 Locais de Moz — Moçambique Digital.</p>
          <nav aria-label="Links legais">
            <div className="flex gap-10">
              <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
              <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
              <a href="mailto:contacto@locaisdemoz.co.mz" className="hover:text-primary transition-colors">Contactos</a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
