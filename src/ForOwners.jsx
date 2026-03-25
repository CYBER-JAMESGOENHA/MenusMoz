import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, Globe, ShieldCheck, Rocket, CheckCircle, AlertCircle, Loader2, Mail, Phone, Building2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { translations } from './translations';

export default function ForOwners({ lang }) {
    const containerRef = useRef(null);
    const [formData, setFormData] = useState({ business_name: '', email: '', whatsapp: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const t = translations[lang].forOwners;

    const BENEFITS = [
        { 
            icon: TrendingUp, 
            title: lang === 'pt' ? "Visibilidade Orgânica" : "Organic Visibility", 
            desc: lang === 'pt' ? "Apareça com destaque nos resultados de busca por culinária." : "Stand out in culinary search results.", 
            color: "primary" 
        },
        { 
            icon: Globe, 
            title: lang === 'pt' ? "Identidade Digital" : "Digital Identity", 
            desc: lang === 'pt' ? "Um showcase interativo e elegante para o seu menu." : "An interactive and elegant showcase for your menu.", 
            color: "accent" 
        },
        { 
            icon: ShieldCheck, 
            title: lang === 'pt' ? "Infraestrutura Premium" : "Premium Infrastructure", 
            desc: lang === 'pt' ? "Tecnologia robusta desenhada para performance real." : "Robust technology designed for real performance.", 
            color: "moz-green" 
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from('.reveal', {
                y: 60, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power4.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.business_name.trim()) {
            newErrors.business_name = lang === 'pt' ? 'Nome do estabelecimento obrigatório.' : 'Business name required.';
        }
        if (!formData.email.trim()) {
            newErrors.email = lang === 'pt' ? 'Email obrigatório.' : 'Email required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = lang === 'pt' ? 'Email inválido.' : 'Invalid email.';
        }
        if (!formData.whatsapp.trim()) {
            newErrors.whatsapp = lang === 'pt' ? 'WhatsApp obrigatório.' : 'WhatsApp required.';
        } else if (!/^[\+\d\s\-\(\)]{8,20}$/.test(formData.whatsapp)) {
            newErrors.whatsapp = lang === 'pt' ? 'Número inválido. Ex: +258 84 000 0000' : 'Invalid number. Ex: +258 84 000 0000';
        }
        return newErrors;
    };

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitState('idle');
        setErrorMsg('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            if (isSupabaseConfigured) {
                const { error } = await supabase
                    .from('owner_applications')
                    .insert([{
                        business_name: formData.business_name.trim(),
                        email: formData.email.trim().toLowerCase(),
                        whatsapp: formData.whatsapp.trim()
                    }]);
                if (error) throw error;
            } else {
                // Fallback: simular envio + log para debug em desenvolvimento
                await new Promise(r => setTimeout(r, 800));
                if (import.meta.env.DEV) console.info('Candidatura (modo local):', formData);
            }
            setSubmitState('success');
            setFormData({ business_name: '', email: '', whatsapp: '' });
        } catch (err) {
            if (import.meta.env.DEV) console.error('Erro ao submeter candidatura:', err);
            setErrorMsg(lang === 'pt' ? 'Erro ao enviar. Tenta novamente ou contacta-nos via WhatsApp.' : 'Error sending. Try again or contact us via WhatsApp.');
            setSubmitState('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="pt-48 pb-40 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-32 items-center mb-40">
                    {/* Left: Benefits */}
                    <div className="reveal">
                        <span className="bg-moz-yellow/10 text-moz-yellow px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-10 inline-block">
                            Business Solutions
                        </span>
                        <h1 className="text-6xl md:text-9xl mb-10 tracking-tighter text-text-main font-display italic leading-[0.85]">
                            {lang === 'pt' ? 'Evolua o seu' : 'Evolve your'} <br /><span className="text-primary italic">{lang === 'pt' ? 'Negócio' : 'Business'}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-dim mb-16 font-medium leading-relaxed italic">
                            "{t.subtitle}"
                        </p>

                        <div className="space-y-12">
                            {BENEFITS.map((item, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <item.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-main uppercase text-xs tracking-[0.2em] mb-2">{item.title}</h4>
                                        <p className="text-text-dim text-lg font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="relative reveal">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-moz-green/10 rounded-full blur-[100px]" />

                        <div className="relative bg-surface/80 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/20 shadow-premium">

                            {/* Success State */}
                            {submitState === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-24 h-24 bg-green-500/10 rounded-[2rem] flex items-center justify-center text-green-500 mx-auto mb-8">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h3 className="text-3xl font-display font-black text-text-main mb-4 tracking-tight">
                                        {lang === 'pt' ? 'Candidatura Recebida!' : 'Application Received!'}
                                    </h3>
                                    <p className="text-text-dim font-medium leading-relaxed mb-8">
                                        {lang === 'pt' ? 'A nossa equipa irá analisar o seu pedido e entrar em contacto em até 48 horas.' : 'Our team will review your request and get in touch within 48 hours.'}
                                    </p>
                                    <button
                                        onClick={() => setSubmitState('idle')}
                                        className="text-primary font-black text-sm uppercase tracking-widest hover:underline"
                                    >
                                        {lang === 'pt' ? 'Submeter nova candidatura →' : 'Submit new application →'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-4xl md:text-5xl mb-10 text-text-main font-display tracking-tight">
                                        {t.form_title}
                                    </h3>

                                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                                        {/* Business Name */}
                                        <div className="space-y-2">
                                            <label htmlFor="fo-business" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block px-1">
                                                {t.name}
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                                                <input
                                                    id="fo-business"
                                                    type="text"
                                                    value={formData.business_name}
                                                    onChange={handleChange('business_name')}
                                                    className={`w-full h-16 pl-14 pr-5 glass border-border-subtle rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-medium text-sm placeholder:text-text-dim/30 ${errors.business_name ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                                    placeholder={lang === 'pt' ? "Ex: Baía Lounge" : "Ex: Bay Lounge"}
                                                    maxLength={100}
                                                />
                                            </div>
                                            {errors.business_name && (
                                                <p className="text-xs text-red-500 font-bold px-1 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {errors.business_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label htmlFor="fo-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block px-1">
                                                {t.email}
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                                                <input
                                                    id="fo-email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange('email')}
                                                    className={`w-full h-16 pl-14 pr-5 glass border-border-subtle rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-medium text-sm placeholder:text-text-dim/30 ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                                    placeholder="gestao@restaurante.com"
                                                    maxLength={200}
                                                    autoComplete="email"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-xs text-red-500 font-bold px-1 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* WhatsApp */}
                                        <div className="space-y-2">
                                            <label htmlFor="fo-phone" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block px-1">
                                                {t.phone}
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                                                <input
                                                    id="fo-phone"
                                                    type="tel"
                                                    value={formData.whatsapp}
                                                    onChange={handleChange('whatsapp')}
                                                    className={`w-full h-16 pl-14 pr-5 glass border-border-subtle rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-medium text-sm placeholder:text-text-dim/30 ${errors.whatsapp ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                                    placeholder="+258 84 000 0000"
                                                    maxLength={20}
                                                    autoComplete="tel"
                                                />
                                            </div>
                                            {errors.whatsapp && (
                                                <p className="text-xs text-red-500 font-bold px-1 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {errors.whatsapp}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit error */}
                                        {submitState === 'error' && (
                                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                                                <AlertCircle size={18} className="text-red-500 shrink-0" />
                                                <p className="text-sm font-bold text-red-600">{errorMsg}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-text-main text-surface py-5 rounded-2xl font-black text-lg hover:bg-primary hover:text-white hover:shadow-primary-glow transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Rocket size={24} />}
                                            {isLoading ? (lang === 'pt' ? 'A enviar...' : 'Sending...') : t.submit}
                                        </button>

                                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-text-dim">
                                            {lang === 'pt' ? 'A nossa equipa entrará em contacto em até 48h.' : 'Our team will contact you within 48h.'}
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
