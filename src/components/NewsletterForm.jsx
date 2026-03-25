import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const NewsletterForm = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // 'idle'|'loading'|'success'|'error'|'duplicate'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email: email.trim().toLowerCase() }]);
        if (error) {
          if (error.code === '23505') { setState('duplicate'); return; }
          throw error;
        }
      } else {
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
      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4" role="alert">
        <CheckCircle size={20} className="text-green-500 shrink-0" aria-hidden="true" />
        <p className="text-sm font-bold text-green-600">
          {lang === 'pt' ? 'Subscrito! Até breve 🎉' : 'Subscribed! See you soon 🎉'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div aria-live="polite" aria-atomic="true">
        {state === 'duplicate' && (
          <p className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-1" role="alert">
            <AlertCircle size={12} aria-hidden="true" />
            {lang === 'pt' ? 'Este email já está subscrito.' : 'Email already subscribed.'}
          </p>
        )}
        {state === 'error' && (
          <p className="text-xs font-bold text-red-500 mb-2 flex items-center gap-1" role="alert">
            <AlertCircle size={12} aria-hidden="true" />
            {lang === 'pt' ? 'Email inválido ou erro.' : 'Invalid email or error.'}
          </p>
        )}
      </div>
      <div className="relative group">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); if (state !== 'idle') setState('idle'); }}
          placeholder={lang === 'pt' ? 'Seu melhor email...' : 'Your best email...'}
          maxLength={200}
          className="w-full h-16 pl-6 pr-32 rounded-2xl glass border border-border-subtle text-text-main placeholder:text-text-dim/40 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
          disabled={state === 'loading'}
          aria-label={lang === 'pt' ? 'Subscrever newsletter' : 'Subscribe newsletter'}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="absolute right-2 top-2 bottom-2 bg-primary text-white px-5 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-primary-glow disabled:opacity-70 flex items-center gap-2"
          aria-label={lang === 'pt' ? 'Subscrever' : 'Subscribe'}
        >
          {state === 'loading' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : 'OK'}
        </button>
      </div>
    </form>
  );
};

export default NewsletterForm;
