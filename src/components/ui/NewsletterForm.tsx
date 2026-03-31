import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface NewsletterFormProps {
  lang: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email: email.trim().toLowerCase() }]);
        if (error) {
          if (error.code === '23505') { setState('duplicate'); return; }
          throw error;
        }
      } else {
        // Fallback for non-configured enviroments
        await new Promise(r => setTimeout(r, 600));
      }
      setState('success');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500" role="alert">
        <CheckCircle size={20} className="text-primary shrink-0" aria-hidden="true" />
        <p className="text-sm font-black text-primary uppercase tracking-tighter italic">
          {lang === 'pt' ? 'Subscrito com sucesso! Até breve 🎉' : 'Successfully subscribed! See you soon 🎉'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <div aria-live="polite" aria-atomic="true" className="min-h-[24px]">
        {state === 'duplicate' && (
          <p className="text-[10px] font-black text-amber-500 mb-2 flex items-center gap-1.5 uppercase tracking-widest animate-in fade-in slide-in-from-top-1" role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            {lang === 'pt' ? 'Este email já faz parte da nossa mesa.' : 'This email is already at our table.'}
          </p>
        )}
        {state === 'error' && (
          <p className="text-[10px] font-black text-red-500 mb-2 flex items-center gap-1.5 uppercase tracking-widest animate-in fade-in slide-in-from-top-1" role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            {lang === 'pt' ? 'Email inválido ou erro de sistema.' : 'Invalid email or system error.'}
          </p>
        )}
      </div>
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); if (state !== 'idle') setState('idle'); }}
          placeholder={lang === 'pt' ? 'Seu melhor email para novos sabores...' : 'Your best email for new flavors...'}
          maxLength={200}
          className="relative w-full h-16 pl-6 pr-32 rounded-2xl glass border border-border-subtle text-text-main placeholder:text-text-dim/40 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
          disabled={state === 'loading'}
          aria-label={lang === 'pt' ? 'Subscrever newsletter' : 'Subscribe newsletter'}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="absolute right-2 top-2 bottom-2 bg-primary text-white px-7 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-primary-glow disabled:opacity-70 flex items-center gap-2 z-10"
          aria-label={lang === 'pt' ? 'Subscrever' : 'Subscribe'}
        >
          {state === 'loading' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : 'OK'}
        </button>
      </div>
    </form>
  );
};

export default NewsletterForm;
