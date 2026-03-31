import React, { useEffect } from 'react';
import { FileCheck, BookOpen, AlertCircle, Scale, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TermsProps {
    lang: string;
}

const Terms = ({ lang }: TermsProps) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';

    const t = {
        pt: {
            title: "Termos de Uso",
            updated: "Última atualização: 25 de Março de 2026",
            intro: "Ao utilizar o portal Locais de Moz, você concorda legalmente com os termos e condições descritos abaixo. Estes termos regem a sua interação com o nosso ecossistema.",
            sections: [
                {
                    icon: BookOpen,
                    title: "1. Termos de Serviço",
                    content: "Ao aceder ao Locais de Moz, você concorda em cumprir integralmente estes termos de serviço, todas as leis e regulamentos de Moçambique e assume total responsabilidade pelo cumprimento de todas as leis locais aplicáveis."
                },
                {
                    icon: FileCheck,
                    title: "2. Licença de Utilização",
                    content: "É concedida permissão para navegar e interagir com os materiais no site Locais de Moz apenas para visualização e uso pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título."
                },
                {
                    icon: AlertCircle,
                    title: "3. Limitação de Responsabilidade",
                    content: "Os materiais no portal Locais de Moz são fornecidos 'como estão'. Não oferecemos garantias, expressas ou implícitas, e, por este meio, isentamos e negamos todas as outras garantias, incluindo, sem limitação, garantias de comercialização."
                },
                {
                    icon: Scale,
                    title: "4. Jurisdição Legal",
                    content: "Qualquer reclamação relativa ao portal Locais de Moz será regida pelas leis do estado de Moçambique, independentemente do conflito de disposições legais."
                }
            ]
        },
        en: {
            title: "Terms of Use",
            updated: "Last updated: March 25, 2026",
            intro: "By using the Locais de Moz portal, you legally agree to the terms and conditions described below. These terms govern your interaction with our ecosystem.",
            sections: [
                {
                    icon: BookOpen,
                    title: "1. Terms of Service",
                    content: "By accessing Locais de Moz, you agree to fully comply with these terms of service, all laws and regulations of Mozambique and assume full responsibility for compliance with all applicable local laws."
                },
                {
                    icon: FileCheck,
                    title: "2. License for Use",
                    content: "Permission is granted to browse and interact with the materials on the Locais de Moz website for personal, non-commercial viewing and use only. This is the grant of a license, not a transfer of title."
                },
                {
                    icon: AlertCircle,
                    title: "3. Limitation of Liability",
                    content: "Materials on the Locais de Moz portal are provided 'as is'. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including, without limitation, merchantability warranties."
                },
                {
                    icon: Scale,
                    title: "4. Legal Jurisdiction",
                    content: "Any claim relating to the Locais de Moz portal will be governed by the laws of the state of Mozambique, regardless of conflict of law provisions."
                }
            ]
        }
    };

    const content = t[selectedLang] || t.pt;

    return (
        <div className="pt-48 pb-32 px-6 bg-bg min-h-screen selection:bg-primary/20 overflow-hidden">
             {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[18rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none rotate-3">
                    Compliance
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
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 mb-6 italic">Legal Department</p>
                            <p className="text-xl md:text-2xl font-black text-text-main italic uppercase tracking-tight leading-relaxed max-w-md mx-auto">
                                {lang === 'pt' ? 'Para suporte jurídico especializado:' : 'For specialized legal support:'}
                                <span className="block text-primary mt-4 underline underline-offset-8 decoration-2 hover:decoration-4 transition-all cursor-pointer">legal@locaisdemoz.co.mz</span>
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
