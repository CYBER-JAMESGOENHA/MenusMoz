import React, { useEffect } from 'react';

export default function PrivacyPolicy() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="pt-48 pb-40 px-4 min-h-screen bg-bg">
            <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] border border-border-subtle shadow-premium">
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Legal</span>
                <h1 className="text-5xl font-display italic font-black text-text-main mb-12 tracking-tighter">Política de Privacidade</h1>
                
                <div className="prose prose-invert prose-p:text-text-dim prose-p:text-lg prose-p:font-medium prose-p:italic space-y-8">
                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">1. Recolha de Dados</h2>
                        <p>No MenusMoz, valorizamos a sua privacidade. Recolhemos apenas os dados necessários para o funcionamento da plataforma, como o seu email quando se subscreve na nossa newsletter ou cria uma conta.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">2. Finalidade</h2>
                        <p>Os seus dados são utilizados exclusivamente para personalizar a sua experiência, gerir favoritos e enviar atualizações relevantes sobre a gastronomia moçambicana. Nunca partilhamos os seus dados com terceiros sem o seu consentimento explícito.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">3. Segurança</h2>
                        <p>Implementamos tecnologias de segurança premium (como RLS e encriptação SSL) para garantir que as suas informações estão protegidas contra acessos não autorizados.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">4. Cookies</h2>
                        <p>Utilizamos cookies para manter a sua sessão ativa e recordar as suas preferências de idioma e tema. Pode gerir estas definições nas configurações do seu browser.</p>
                    </section>

                    <p className="pt-10 border-t border-border-subtle text-sm opacity-50 font-black uppercase tracking-widest">Última atualização: 24 de Março de 2026</p>
                </div>
            </div>
        </div>
    );
}
