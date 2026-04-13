import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  logo: string | null;
  cover_url: string | null;
  latitude: string | null;
  longitude: string | null;
}

type ImageField = 'cover_url' | 'image_url' | 'logo';

export default function AdminImages() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ id: number; field: ImageField } | null>(null);
  const [saved, setSaved] = useState<{ id: number; field: ImageField } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    setLoading(true);
    const { data, error } = await supabase!
      .from('restaurants')
      .select('id, name, slug, image_url, logo, cover_url, latitude, longitude')
      .order('id');
    if (!error && data) setRestaurants(data as Restaurant[]);
    setLoading(false);
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    restaurant: Restaurant,
    field: ImageField
  ) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setError(null);
    setUploading({ id: restaurant.id, field });

    try {
      // Upload to Supabase Storage
      const ext = file.name.split('.').pop();
      const path = `${restaurant.slug}/${field}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('Restaurant Images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('Restaurant Images')
        .getPublicUrl(path);

      // Save URL to the correct column in restaurants table
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ [field]: publicUrl })
        .eq('id', restaurant.id);

      if (updateError) throw updateError;

      // Update local state
      setRestaurants(prev =>
        prev.map(r => r.id === restaurant.id ? { ...r, [field]: publicUrl } : r)
      );

      setSaved({ id: restaurant.id, field });
      setTimeout(() => setSaved(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload.');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  const handleUrlSave = async (restaurant: Restaurant, field: ImageField, url: string) => {
    if (!supabase || !url.trim()) return;
    setUploading({ id: restaurant.id, field });
    setError(null);

    const { error } = await supabase
      .from('restaurants')
      .update({ [field]: url.trim() })
      .eq('id', restaurant.id);

    if (error) {
      setError(error.message);
    } else {
      setRestaurants(prev =>
        prev.map(r => r.id === restaurant.id ? { ...r, [field]: url.trim() } : r)
      );
      setSaved({ id: restaurant.id, field });
      setTimeout(() => setSaved(null), 3000);
    }
    setUploading(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg pt-32">
      <Loader2 size={40} className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Admin Panel
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black italic uppercase tracking-tighter text-text-main mt-3 leading-none">
              Imagens dos <span className="text-primary">Restaurantes</span>
            </h1>
            <p className="text-text-dim text-sm mt-3 font-medium">
              Carregue duas imagens separadas por restaurante: a <strong>foto de capa</strong> (cartão) e o <strong>logótipo/avatar</strong>.
            </p>
          </div>
          <button
            onClick={fetchRestaurants}
            className="w-12 h-12 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center text-text-dim hover:text-primary hover:border-primary/30 transition-all"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { color: 'bg-blue-500', label: 'Capa / Foto do Cartão', desc: 'Imagem grande no cartão (cover_url)' },
            { color: 'bg-primary', label: 'Logótipo / Avatar', desc: 'Círculo pequeno no cartão (image_url)' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface rounded-2xl px-4 py-3 border border-border-subtle">
              <div className={`w-4 h-4 rounded-full ${item.color}`} />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-text-main">{item.label}</p>
                <p className="text-[10px] text-text-dim">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Restaurant Cards */}
        <div className="space-y-6">
          {restaurants.map(restaurant => (
            <RestaurantImageRow
              key={restaurant.id}
              restaurant={restaurant}
              uploading={uploading}
              saved={saved}
              onFileUpload={handleFileUpload}
              onUrlSave={handleUrlSave}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Per-restaurant row ─────────────────────────────────────────────── */
function RestaurantImageRow({
  restaurant,
  uploading,
  saved,
  onFileUpload,
  onUrlSave,
}: {
  restaurant: Restaurant;
  uploading: { id: number; field: ImageField } | null;
  saved: { id: number; field: ImageField } | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, r: Restaurant, f: ImageField) => void;
  onUrlSave: (r: Restaurant, f: ImageField, url: string) => void;
}) {
  return (
    <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden shadow-sm">
      {/* Restaurant Name Header */}
      <div className="px-6 py-4 border-b border-border-subtle bg-primary/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
          {restaurant.id}
        </div>
        <h2 className="font-display font-black text-xl italic uppercase tracking-tighter text-text-main">
          {restaurant.name}
        </h2>
        {restaurant.latitude && restaurant.longitude && (
          <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            📍 GPS: {parseFloat(restaurant.latitude).toFixed(4)}, {parseFloat(restaurant.longitude).toFixed(4)}
          </span>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadSlot
          label="Foto de Capa"
          sublabel="Imagem grande no cartão"
          color="blue"
          field="cover_url"
          currentUrl={restaurant.cover_url}
          restaurant={restaurant}
          isUploading={uploading?.id === restaurant.id && uploading?.field === 'cover_url'}
          isSaved={saved?.id === restaurant.id && saved?.field === 'cover_url'}
          onFileUpload={onFileUpload}
          onUrlSave={onUrlSave}
        />
        <ImageUploadSlot
          label="Logótipo / Avatar"
          sublabel="Círculo pequeno no cartão"
          color="primary"
          field="image_url"
          currentUrl={restaurant.image_url}
          restaurant={restaurant}
          isUploading={uploading?.id === restaurant.id && uploading?.field === 'image_url'}
          isSaved={saved?.id === restaurant.id && saved?.field === 'image_url'}
          onFileUpload={onFileUpload}
          onUrlSave={onUrlSave}
        />
      </div>
    </div>
  );
}

/* ─── Single image upload slot ───────────────────────────────────────── */
function ImageUploadSlot({
  label, sublabel, color, field, currentUrl, restaurant,
  isUploading, isSaved, onFileUpload, onUrlSave,
}: {
  label: string;
  sublabel: string;
  color: 'blue' | 'primary';
  field: ImageField;
  currentUrl: string | null;
  restaurant: Restaurant;
  isUploading: boolean;
  isSaved: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, r: Restaurant, f: ImageField) => void;
  onUrlSave: (r: Restaurant, f: ImageField, url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrl, setShowUrl] = useState(false);

  const colorClass = color === 'blue' ? 'text-blue-600 bg-blue-500/10 border-blue-500/20' : 'text-primary bg-primary/10 border-primary/20';
  const dotClass = color === 'blue' ? 'bg-blue-500' : 'bg-primary';

  return (
    <div className="space-y-3">
      {/* Slot header */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${dotClass}`} />
        <div>
          <p className="font-black text-xs uppercase tracking-widest text-text-main">{label}</p>
          <p className="text-[10px] text-text-dim">{sublabel}</p>
        </div>
        {isSaved && (
          <CheckCircle size={16} className="text-green-500 ml-auto animate-in fade-in" />
        )}
      </div>

      {/* Preview */}
      <div
        className={`relative w-full aspect-video rounded-2xl overflow-hidden border-2 ${currentUrl ? 'border-border-subtle' : 'border-dashed border-border-subtle'} bg-bg flex items-center justify-center`}
      >
        {currentUrl ? (
          <>
            <img
              src={currentUrl}
              alt={label}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = ''; }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-dim/40">
            <ImageIcon size={32} />
            <p className="text-[11px] font-black uppercase tracking-wider">Sem imagem</p>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 size={28} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload actions */}
      <div className="flex gap-2">
        {/* File upload button */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border ${colorClass} hover:opacity-80 disabled:opacity-50`}
        >
          <Upload size={14} />
          Carregar Ficheiro
        </button>

        {/* URL toggle */}
        <button
          onClick={() => setShowUrl(v => !v)}
          className="px-3 py-3 rounded-xl border border-border-subtle text-text-dim hover:text-text-main hover:border-primary/30 transition-all text-[11px] font-black uppercase tracking-wider"
          title="Colar URL"
        >
          URL
        </button>
      </div>

      {/* URL input */}
      {showUrl && (
        <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 h-10 px-3 rounded-xl border border-border-subtle bg-bg text-text-main text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <button
            onClick={() => { onUrlSave(restaurant, field, urlInput); setUrlInput(''); setShowUrl(false); }}
            disabled={!urlInput.trim() || isUploading}
            className="px-4 h-10 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            Guardar
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => onFileUpload(e, restaurant, field)}
      />
    </div>
  );
}
