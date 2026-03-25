import React, { useEffect } from 'react';

const Terms = ({ lang }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = {
    pt: {
      title: "Termos de Uso",
      updated: "Última atualização: 25 de Março de 2026",
      intro: "Ao utilizar o MenusMoz, concorda com os termos e condições abaixo. Por favor, leia-os cuidadosamente.",
      sections: [
        {
            title: "1. Termos",
            content: "Ao aceder ao MenusMoz, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis."
        },
        {
            title: "2. Licença de Uso",
            content: "É concedida permissão para descarregar temporariamente uma cópia dos materiais no site MenusMoz apenas para visualização transitória pessoal e não comercial."
        },
        {
            title: "3. Isenção de Responsabilidade",
            content: "Os materiais no site MenusMoz são fornecidos 'como estão'. MenusMoz não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias."
        }
      ]
    },
    en: {
      title: "Terms of Use",
      updated: "Last updated: March 25, 2026",
      intro: "By using MenusMoz, you agree to the terms and conditions below. Please read them carefully.",
      sections: [
        {
            title: "1. Terms",
            content: "By accessing MenusMoz, you agree to comply with these terms of service, all applicable laws and regulations and agree that you are responsible for compliance with all applicable local laws."
        },
        {
            title: "2. License of Use",
            content: "Permission is granted to temporarily download one copy of the materials on the MenusMoz website for personal, non-commercial transitory viewing only."
        },
        {
            title: "3. Disclaimer",
            content: "The materials on the MenusMoz website are provided 'as is'. MenusMoz makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties."
        }
      ]
    }
  };

  const content = t[lang] || t.pt;

  return (
    <div className="pt-40 pb-32 px-4 bg-bg min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-text-main mb-6 italic leading-none">
          {content.title}
        </h1>
        <p className="text-text-dim text-xs font-black uppercase tracking-widest mb-12">
          {content.updated}
        </p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-text-dim font-medium leading-relaxed italic mb-12 border-l-4 border-primary pl-8">
            "{content.intro}"
          </p>
          
          {content.sections.map((section, i) => (
            <section key={i} className="mb-12">
              <h2 className="text-3xl font-display font-black text-text-main mb-4 italic tracking-tight">
                {section.title}
              </h2>
              <p className="text-text-dim text-lg leading-relaxed font-medium">
                {section.content}
              </p>
            </section>
          ))}
          
          <div className="mt-20 p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
            <p className="text-primary text-sm font-bold text-center">
              {lang === 'pt' ? 'Para suporte legal: legal@locaisdemoz.co.mz' : 'For legal support: legal@locaisdemoz.co.mz'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
