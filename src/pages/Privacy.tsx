import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PrivacyProps {
    lang: string;
}

const Privacy = ({ lang }: PrivacyProps) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';

    const t = {
        pt: {
            title: "Política de Privacidade",
            updated: "Última atualização: 25 de Março de 2026",
            intro: "No Locais de Moz, a sua privacidade é a nossa prioridade. Esta política explica como recolhemos e protegemos os seus dados de forma transparente e rigorosa.",
            sections: [
                {
                    icon: Eye,
                    title: "1. Recolha de Informação",
                    content: "Recolhemos informações quando se regista no nosso ecossistema, faz login na sua conta ou guarda restaurantes favoritos. As informações recolhidas incluem o seu nome e endereço de e-mail."
                },
                {
                    icon: Lock,
                    title: "2. Utilização da Informação",
                    content: "Qualquer informação que recolhemos de si pode ser usada para personalizar a sua experiência gastronómica, melhorar o nosso portal e elevar o serviço de apoio ao cliente."
                },
                {
                    icon: Shield,
                    title: "3. Proteção de Dados",
                    content: "Implementamos uma variedade de medidas de segurança para manter a integridade das suas informações. Utilizamos criptografia de ponta e os seus dados são armazenados de forma robusta via Supabase."
                },
                 {
                    icon: FileText,
                    title: "4. Direitos do Utilizador",
                    content: "Você tem o direito de aceder, retificar ou apagar os seus dados a qualquer momento através do seu perfil ou contactando a nossa equipa de suporte especializado."
                }
            ]
        },
        en: {
            title: "Privacy Policy",
            updated: "Last updated: March 25, 2026",
            intro: "At Locais de Moz, your privacy is our priority. This policy explains how we collect and protect your data in a transparent and rigorous manner.",
            sections: [
                {
                    icon: Eye,
                    title: "1. Information Collection",
                    content: "We collect information when you register in our ecosystem, log in to your account, or save favorite restaurants. The information collected includes your name and email address."
                },
                {
                    icon: Lock,
                    title: "2. Use of Information",
                    content: "Any information we collect from you may be used to personalize your dining experience, improve our portal, and elevate customer service."
                },
                {
                    icon: Shield,
                    title: "3. Data Protection",
                    content: "We implement a variety of security measures to maintain the integrity of your information. We use state-of-the-art encryption and your data is stored robustly via Supabase."
                },
                {
                    icon: FileText,
                    title: "4. User Rights",
                    content: "You have the right to access, rectify or delete your data at any time through your profile or by contacting our specialized support team."
                }
            ]
        }
    };

    const content = t[selectedLang] || t.pt;

    return (
        <div className="pt-48 pb-32 px-6 bg-bg min-h-screen selection:bg-primary/20 overflow-hidden">
             {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[18rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none -rotate-3">
                    Privacy
                </span>
            </div>

            <div className="max-w-4xl mx-auto">
                 <Link
                    to="/"
                    className="group inline-flex items-center gap-3 text-text-dim hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.4em] italic mb-16 blog-post-reveal"
                >
                    <div className="w-10 h-10 rounded-xl glass border border-border-subtle flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    {lang === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
                </Link>

                <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-text-main mb-6 italic leading-none uppercase blog-post-reveal">
                    {content.title}
                </h1>
                <p className="text-text-dim/40 text-[10px] font-black uppercase tracking-[0.5em] mb-16 italic blog-post-reveal">
                    {content.updated}
                </p>
                
                <div className="space-y-20 blog-post-reveal">
                    <p className="text-2xl md:text-3xl text-text-dim font-bold leading-tight italic uppercase tracking-tighter opacity-70 mb-20 border-l-4 border-primary pl-10 py-2">
                        "{content.intro}"
                    </p>
                    
                    <div className="grid gap-16">
                        {content.sections.map((section, i) => (
                            <section key={i} className="group relative">
                                <div className="flex items-start gap-10">
                                    <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm border border-primary/10">
                                        <section.icon size={28} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-display font-black text-text-main mb-6 italic tracking-tight uppercase group-hover:text-primary transition-colors">
                                            {section.title}
                                        </h2>
                                        <p className="text-text-dim/70 text-xl leading-relaxed font-bold italic uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                    
                    <div className="mt-32 p-12 md:p-16 rounded-[3.5rem] glass border border-primary/10 shadow-premium text-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 mb-6 italic">Support & Security</p>
                            <p className="text-xl md:text-2xl font-black text-text-main italic uppercase tracking-tight leading-relaxed max-w-md mx-auto">
                                {lang === 'pt' ? 'Para qualquer dúvida, contacte-nos em:' : 'For any questions, contact us at:'}
                                <span className="block text-primary mt-4 underline underline-offset-8 decoration-2 hover:decoration-4 transition-all cursor-pointer">privacidade@locaisdemoz.co.mz</span>
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
