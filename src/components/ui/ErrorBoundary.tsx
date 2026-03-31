import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    lang?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class GlobalErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if ((import.meta as any).env.DEV) {
            console.error('Uncaught error:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            const lang = (this.props.lang || 'pt') as 'pt' | 'en';
            const t = {
                pt: {
                    title: "Ocorreu um erro inesperado",
                    desc: "Lamentamos, mas algo correu mal. A nossa equipa foi notificada.",
                    btn: "Recarregar Página"
                },
                en: {
                    title: "An unexpected error occurred",
                    desc: "We're sorry, but something went wrong. Our team has been notified.",
                    btn: "Reload Page"
                }
            };
            const msg = t[lang] || t.pt;

            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 text-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center text-red-500 text-5xl font-display font-black mb-10 shadow-xl border border-red-500/20">!</div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-text-main tracking-tighter mb-6 italic uppercase leading-none">
                        {msg.title}
                    </h1>
                    <p className="text-text-dim text-xl font-bold max-w-md mx-auto mb-12 leading-relaxed italic opacity-80 uppercase tracking-tight">
                        "{msg.desc}"
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white px-12 py-5 rounded-full font-black text-lg hover:brightness-110 active:scale-95 transition-all shadow-primary-glow uppercase tracking-[0.2em]"
                    >
                        {msg.btn}
                    </button>
                    {(import.meta as any).env.DEV && (
                        <div className="mt-16 p-8 bg-surface border border-border-subtle rounded-[2rem] max-w-2xl text-left overflow-auto max-h-60 shadow-premium">
                            <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-3 opacity-50">Debug Info — Dev Mode</p>
                            <code className="text-xs font-mono text-red-500 leading-relaxed block">{this.state.error?.toString()}</code>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
