import React, { useEffect } from 'react';

export default function TermsOfUse() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="pt-48 pb-40 px-4 min-h-screen bg-bg">
            <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] border border-border-subtle shadow-premium">
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Direitos & Deveres</span>
                <h1 className="text-5xl font-display italic font-black text-text-main mb-12 tracking-tighter">Termos de Utilização</h1>
                
                <div className="prose prose-invert prose-p:text-text-dim prose-p:text-lg prose-p:font-medium prose-p:italic space-y-8">
                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">1. Aceitação dos Termos</h2>
                        <p>Ao aceder ao MenusMoz, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. Se não concordar com algum destes termos, está proibido de usar este site.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">2. Licença de Uso</h2>
                        <p>É concedida permissão para visualizar temporariamente o conteúdo do site para uso pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">3. Responsabilidade</h2>
                        <p>A informação apresentada sobre os restaurantes (preços, menus, horários) é fornecida pelos próprios. O MenusMoz esforça-se por manter os dados atualizados, mas não garante a precisão absoluta em tempo real.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-display font-black text-text-main mb-4 italic">4. Modificações</h2>
                        <p>O MenusMoz pode rever estes termos de serviço para o seu site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
                    </section>

                    <p className="pt-10 border-t border-border-subtle text-sm opacity-50 font-black uppercase tracking-widest">Última atualização: 24 de Março de 2026</p>
                </div>
            </div>
        </div>
    );
}
