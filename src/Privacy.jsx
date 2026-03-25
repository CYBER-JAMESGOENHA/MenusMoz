import React, { useEffect } from 'react';

const Privacy = ({ lang }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = {
    pt: {
      title: "Política de Privacidade",
      updated: "Última atualização: 25 de Março de 2026",
      intro: "No MenusMoz, a sua privacidade é a nossa prioridade. Esta política explica como recolhemos e protegemos os seus dados.",
      sections: [
        {
            title: "1. Recolha de Informação",
            content: "Recolhemos informações quando se regista no nosso site, faz login na sua conta ou guarda restaurantes favoritos. As informações recolhidas incluem o seu nome e endereço de e-mail."
        },
        {
            title: "2. Utilização da Informação",
            content: "Qualquer informação que recolhemos de si pode ser usada para personalizar a sua experiência, melhorar o nosso site e o serviço de apoio ao cliente."
        },
        {
            title: "3. Proteção de Dados",
            content: "Implementamos uma variedade de medidas de segurança para manter a segurança das suas informações pessoais. Utilizamos criptografia de ponta e os seus dados são armazenados de forma segura via Supabase."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      updated: "Last updated: March 25, 2026",
      intro: "At MenusMoz, your privacy is our priority. This policy explains how we collect and protect your data.",
      sections: [
        {
            title: "1. Information Collection",
            content: "We collect information when you register on our site, log in to your account, or save favorite restaurants. The information collected includes your name and email address."
        },
        {
            title: "2. Use of Information",
            content: "Any information we collect from you may be used to personalize your experience, improve our website, and improve customer service."
        },
        {
            title: "3. Data Protection",
            content: "We implement a variety of security measures to maintain the safety of your personal information. We use state-of-the-art encryption and your data is stored securely via Supabase."
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
              {lang === 'pt' ? 'Para qualquer dúvida, contacte-nos em: privacidade@locaisdemoz.co.mz' : 'For any questions, contact us at: privacy@locaisdemoz.co.mz'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
