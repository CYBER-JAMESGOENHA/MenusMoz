import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        if (import.meta.env.DEV) {
            console.error('Uncaught error:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            const lang = this.props.lang || 'pt';
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
                    <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 text-5xl font-display font-black mb-8 shadow-xl">!</div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-text-main tracking-tighter mb-4 italic">
                        {msg.title}
                    </h1>
                    <p className="text-text-dim font-medium max-w-md mx-auto mb-10 leading-relaxed italic">
                        "{msg.desc}"
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white px-10 py-4 rounded-full font-black hover:brightness-110 transition-all shadow-primary-glow"
                    >
                        {msg.btn}
                    </button>
                    {import.meta.env.DEV && (
                        <div className="mt-12 p-6 bg-surface border border-border-subtle rounded-2xl max-w-2xl text-left overflow-auto max-h-40">
                            <p className="text-xs font-mono text-red-500">{this.state.error?.toString()}</p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
