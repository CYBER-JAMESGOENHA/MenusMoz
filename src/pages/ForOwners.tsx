import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, Globe, ShieldCheck, Rocket, CheckCircle, AlertCircle, Loader2, Mail, Phone, Building2, Layout, Zap, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { translations } from '../translations';

interface ForOwnersProps {
    lang: string;
}

interface FormData {
    business_name: string;
    email: string;
    whatsapp: string;
}

interface FormErrors {
    business_name?: string;
    email?: string;
    whatsapp?: string;
}

export default function ForOwners({ lang }: ForOwnersProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FormData>({ business_name: '', email: '', whatsapp: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    
    const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';
    const t = (translations[selectedLang]?.forOwners || translations.pt.forOwners) as any;

    const BENEFITS = [
        { 
            icon: TrendingUp, 
            title: selectedLang === 'pt' ? "Visibilidade Orgânica" : "Organic Visibility", 
            desc: selectedLang === 'pt' ? "Apareça com destaque nos resultados de busca por culinária de elite." : "Stand out in elite culinary search results.", 
            color: "primary" 
        },
        { 
            icon: Globe, 
            title: selectedLang === 'pt' ? "Identidade Digital" : "Digital Identity", 
            desc: selectedLang === 'pt' ? "Um showcase interativo e elegante para o seu menu e atmosfera." : "An interactive and elegant showcase for your menu and atmosphere.", 
            color: "accent" 
        },
        { 
            icon: ShieldCheck, 
            title: selectedLang === 'pt' ? "Infraestrutura Premium" : "Premium Infrastructure", 
            desc: selectedLang === 'pt' ? "Tecnologia robusta desenhada para converter visitas em clientes." : "Robust technology designed to convert visits into customers.", 
            color: "moz-green" 
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.reveal', {
                y: 80, opacity: 0, duration: 1.5, stagger: 0.25, ease: 'power4.out', clearProps: 'all'
            });
        }, containerRef.current);
        return () => ctx.revert();
    }, []);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.business_name.trim()) {
            newErrors.business_name = selectedLang === 'pt' ? 'Nome do estabelecimento obrigatório.' : 'Business name required.';
        }
        if (!formData.email.trim()) {
            newErrors.email = selectedLang === 'pt' ? 'Email obrigatório.' : 'Email required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = selectedLang === 'pt' ? 'Email inválido.' : 'Invalid email.';
        }
        if (!formData.whatsapp.trim()) {
            newErrors.whatsapp = selectedLang === 'pt' ? 'WhatsApp obrigatório.' : 'WhatsApp required.';
        } else if (!/^[+\d\s\-()]{8,20}$/.test(formData.whatsapp)) {
            newErrors.whatsapp = selectedLang === 'pt' ? 'Número inválido. Ex: +258 84 000 0000' : 'Invalid number. Ex: +258 84 000 0000';
        }
        return newErrors;
    };

    const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            if (isSupabaseConfigured && supabase) {
                const { error } = await supabase
                    .from('owner_applications')
                    .insert([{
                        business_name: formData.business_name.trim(),
                        email: formData.email.trim().toLowerCase(),
                        whatsapp: formData.whatsapp.trim()
                    }]);
                if (error) throw error;
            } else {
                // Fallback: simulate send in development
                await new Promise(r => setTimeout(r, 1200));
            }
            setSubmitState('success');
            setFormData({ business_name: '', email: '', whatsapp: '' });
        } catch (err) {
            setErrorMsg(selectedLang === 'pt' ? 'Erro ao enviar. Tenta novamente ou contacta o suporte.' : 'Error sending. Try again or contact support.');
            setSubmitState('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="pt-56 pb-40 px-6 bg-bg selection:bg-primary/20 overflow-hidden">
             {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[18rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none rotate-3">
                    Business
                </span>
            </div>

            <div className="max-w-[1440px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-32 items-center mb-48">
                    {/* Left: Benefits */}
                    <div className="reveal">
                        <div className="flex items-center gap-3 mb-10">
                            <Zap size={14} className="text-primary" />
                            <span className="bg-primary/10 text-primary px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.5em] shadow-sm">
                                Premium Partners
                            </span>
                        </div>
                        <h1 className="text-8xl md:text-[10rem] mb-12 tracking-tighter text-text-main font-display font-black italic leading-[0.8] uppercase">
                            {selectedLang === 'pt' ? 'Eleve o seu' : 'Scale your'} <br /><span className="text-primary italic">Negócio</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-text-dim/80 mb-20 font-black leading-tight italic uppercase tracking-tighter max-w-2xl opacity-70">
                            "{t.subtitle}"
                        </p>

                        <div className="space-y-16">
                            {BENEFITS.map((item, i) => (
                                <div key={i} className="flex gap-10 group overflow-hidden">
                                    <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm border border-primary/10">
                                        <item.icon size={36} strokeWidth={2.5} />
                                    </div>
                                    <div className="py-2">
                                        <h4 className="font-black text-text-main uppercase text-sm tracking-[0.3em] mb-4 italic leading-none">{item.title}</h4>
                                        <p className="text-text-dim text-xl font-bold italic uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Registration Form */}
                    <div className="relative reveal">
                        {/* Elegant Glowing Spheres */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] transition-all duration-[2000ms] animate-pulse" />
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-moz-green/5 rounded-full blur-[120px]" />

                        <div className="relative bg-surface p-12 md:p-20 rounded-[4.5rem] border border-border-subtle shadow-premium overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

                            {submitState === 'success' ? (
                                <div className="text-center py-10 animate-in fade-in zoom-in duration-700">
                                    <div className="w-28 h-28 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-primary-glow/10">
                                        <CheckCircle size={54} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-5xl font-display font-black text-text-main mb-6 tracking-tighter italic uppercase leading-none">
                                        {selectedLang === 'pt' ? 'Mesa Reservada!' : 'Table Reserved!'}
                                    </h3>
                                    <p className="text-text-dim text-xl font-bold italic uppercase tracking-tight opacity-70 mb-12 leading-relaxed px-6">
                                        {selectedLang === 'pt' ? 'A nossa equipa irá analisar o seu perfil e entrar em contacto em até 48 horas.' : 'Our team will review your profile and get in touch within 48 hours.'}
                                    </p>
                                    <button
                                        onClick={() => setSubmitState('idle')}
                                        className="bg-text-main text-surface px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-premium italic"
                                    >
                                        {selectedLang === 'pt' ? 'Submeter Nova Candidatura' : 'Submit New Application'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-14">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Layout size={14} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{selectedLang === 'pt' ? 'Formulário de Acesso' : 'Access Form'}</span>
                                        </div>
                                        <h3 className="text-5xl md:text-6xl mb-4 text-text-main font-display font-black tracking-tighter italic uppercase leading-none">
                                            {t.form_title}
                                        </h3>
                                    </div>

                                    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                                        {/* Business Name */}
                                        <div className="space-y-3">
                                            <label htmlFor="fo-business" className="text-[10px] font-black uppercase tracking-[0.5em] text-text-dim/60 block px-1 ml-0.5 italic">
                                                {t.name}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim/40 group-focus-within:text-primary transition-colors" size={20} />
                                                <input
                                                    id="fo-business"
                                                    type="text"
                                                    value={formData.business_name}
                                                    onChange={handleChange('business_name')}
                                                    className={`relative w-full h-16 pl-16 pr-6 glass border border-border-subtle rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-bold text-sm placeholder:text-text-dim/20 uppercase tracking-tight ${errors.business_name ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                                    placeholder={selectedLang === 'pt' ? "EX: RESTAURANTE ZAMBEZE" : "EX: ZAMBEZE RESTAURANT"}
                                                    maxLength={100}
                                                />
                                            </div>
                                            {errors.business_name && (
                                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest px-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                                    <AlertCircle size={14} /> {errors.business_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-3">
                                            <label htmlFor="fo-email" className="text-[10px] font-black uppercase tracking-[0.5em] text-text-dim/60 block px-1 ml-0.5 italic">
                                                {t.email}
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim/40 group-focus-within:text-primary transition-colors" size={20} />
                                                <input
                                                    id="fo-email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange('email')}
                                                    className={`relative w-full h-16 pl-16 pr-6 glass border border-border-subtle rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-bold text-sm placeholder:text-text-dim/20 tracking-tight ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                                    placeholder="GESTAO@REST.MOZ"
                                                    maxLength={200}
                                                    autoComplete="email"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest px-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                                    <AlertCircle size={14} /> {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* WhatsApp */}
                                        <div className="space-y-3">
                                            <label htmlFor="fo-phone" className="text-[10px] font-black uppercase tracking-[0.5em] text-text-dim/60 block px-1 ml-0.5 italic">
                                                {t.phone} ({selectedLang === 'pt' ? 'WHATSAPP' : 'WHATSAPP'})
                                            </label>
                                            <div className="relative group">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim/40 group-focus-within:text-primary transition-colors" size={20} />
                                                <input
                                                    id="fo-phone"
                                                    type="tel"
                                                    value={formData.whatsapp}
                                                    onChange={handleChange('whatsapp')}
                                                    className={`relative w-full h-16 pl-16 pr-6 glass border border-border-subtle rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-bold text-sm placeholder:text-text-dim/20 tracking-tight ${errors.whatsapp ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                                    placeholder="+258 84 000 0000"
                                                    maxLength={20}
                                                    autoComplete="tel"
                                                />
                                            </div>
                                            {errors.whatsapp && (
                                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest px-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                                    <AlertCircle size={14} /> {errors.whatsapp}
                                                </p>
                                            )}
                                        </div>

                                        {/* Error Feedback */}
                                        {submitState === 'error' && (
                                            <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 animate-in fade-in slide-in-from-top-2">
                                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                                <p className="text-xs font-black uppercase text-red-600 italic tracking-tight">{errorMsg}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="group relative w-full overflow-hidden bg-text-main text-surface h-20 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-premium hover:shadow-primary-glow flex items-center justify-center gap-4 active:scale-95 duration-500 italic"
                                        >
                                            {isLoading ? <Loader2 size={28} className="animate-spin" /> : <Rocket size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                            {isLoading ? (selectedLang === 'pt' ? 'A Processar...' : 'Processing...') : (
                                                <span className="flex items-center gap-3">
                                                    {t.submit} <ArrowRight size={20} strokeWidth={3} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                                </span>
                                            )}
                                        </button>

                                        <div className="flex items-center justify-center gap-4 opacity-40">
                                            <div className="h-px bg-text-dim flex-1" />
                                            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-text-dim italic">
                                                {selectedLang === 'pt' ? 'Privacidade Garantida' : 'Privacy Secured'}
                                            </p>
                                            <div className="h-px bg-text-dim flex-1" />
                                        </div>
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
