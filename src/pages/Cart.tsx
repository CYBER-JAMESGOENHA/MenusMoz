import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft, StickyNote, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../context/CartContext';
import { translations } from '../translations';

interface CartPageProps {
    lang: string;
}

export default function CartPage({ lang }: CartPageProps) {
    const { cart, addToCart, removeFromCart, clearCart, totalItems, grandTotal, restaurantName, whatsapp } = useCart();
    const navigate = useNavigate();
    const [expandedNote, setExpandedNote] = useState<string | null>(null);
    const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';
    const t = (translations[selectedLang] || translations.pt) as any;

    const noteKey = (itemName: string, cat: string) => `${itemName}__${cat}`;

    const sendToWhatsApp = () => {
        if (!whatsapp || cart.length === 0) return;
        const lines = cart.map(c => {
            const note = itemNotes[noteKey(c.name, c.categoryName)];
            return `• ${c.qty}x ${c.name} (${c.price})${note ? ` — Nota: ${note}` : ''}`;
        });
        const totalLine = grandTotal > 0 ? `\n\nTotal estimado: ${formatPrice(grandTotal)}` : '';
        const resName = restaurantName ? ` no ${restaurantName}` : '';
        const msg = `Olá, gostaria de fazer o seguinte pedido${resName} via Locais de Moz:\n\n${lines.join('\n')}${totalLine}\n\nObrigado!`;
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            clearCart();
            navigate('/', { replace: true });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-bg pt-24 pb-32 md:pt-32 md:pb-40">
            <Helmet>
                <title>O Seu Pedido — Locais de Moz</title>
            </Helmet>

            {/* Back button */}
            <div className="max-w-2xl mx-auto px-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-dim hover:text-primary transition-colors text-sm font-black uppercase tracking-wider"
                >
                    <ArrowLeft size={16} /> Voltar
                </button>
            </div>

            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-display font-black italic uppercase tracking-tighter text-text-main">
                        O Seu Pedido
                    </h1>
                    {restaurantName && (
                        <p className="text-text-dim text-sm font-black uppercase tracking-widest mt-2 opacity-60">
                            em {restaurantName}
                        </p>
                    )}
                </div>

                {/* Success State */}
                {showSuccess ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-black italic uppercase tracking-tighter text-text-main">Pedido Enviado!</h3>
                            <p className="text-text-dim text-sm mt-2">A redirecionar para o WhatsApp do restaurante...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                <div className="w-20 h-20 bg-surface rounded-3xl border border-border-subtle flex items-center justify-center text-4xl">
                                    🛒
                                </div>
                                <div>
                                    <p className="font-black text-text-main uppercase tracking-tight text-xl">Carrinho vazio</p>
                                    <p className="text-text-dim text-sm mt-1">Adicione itens do menu para começar</p>
                                </div>
                                <Link
                                    to="/restaurantes"
                                    className="mt-4 px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-premium"
                                >
                                    Explorar Restaurantes
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {/* Clear button */}
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={clearCart}
                                        className="h-9 px-4 rounded-xl bg-surface border border-border-subtle text-text-dim hover:text-red-500 hover:border-red-200 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Limpar Tudo
                                    </button>
                                </div>

                                {/* Items */}
                                {cart.map((item, i) => {
                                    const nk = noteKey(item.name, item.categoryName);
                                    const isNoteOpen = expandedNote === nk;
                                    return (
                                        <div key={i} className="py-5 border-b border-border-subtle/40 last:border-0">
                                            <div className="flex items-start gap-4">
                                                {/* Thumbnail */}
                                                {item.image_url && (
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-border-subtle bg-surface">
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-black text-text-main block leading-snug text-lg">{item.name}</span>
                                                    <span className="text-xs font-black uppercase tracking-wider text-text-dim opacity-50">{item.categoryName}</span>
                                                    {itemNotes[nk] && !isNoteOpen && (
                                                        <p className="text-sm text-text-dim mt-2 italic line-clamp-1">📝 {itemNotes[nk]}</p>
                                                    )}
                                                </div>
                                                {/* Right: price + qty */}
                                                <div className="flex flex-col items-end gap-3 shrink-0">
                                                    <span className="font-black text-primary text-lg">{item.price}</span>
                                                    <div className="flex items-center gap-2 bg-surface rounded-2xl p-1.5 border border-border-subtle shadow-sm">
                                                        <button
                                                            onClick={() => removeFromCart(item.name, item.categoryName)}
                                                            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                                                        >
                                                            {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                                        </button>
                                                        <span className="w-6 text-center font-black text-base">{item.qty}</span>
                                                        <button
                                                            onClick={() => addToCart({ name: item.name, price: item.price, categoryName: item.categoryName, image_url: item.image_url })}
                                                            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Note toggle */}
                                            <div className="mt-3 ml-0">
                                                {isNoteOpen ? (
                                                    <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Ex: sem cebola, bem passado..."
                                                            value={itemNotes[nk] || ''}
                                                            onChange={e => setItemNotes(prev => ({ ...prev, [nk]: e.target.value }))}
                                                            onBlur={() => setExpandedNote(null)}
                                                            autoFocus
                                                            className="flex-1 text-sm bg-surface border border-border-subtle rounded-xl px-4 py-2.5 text-text-main placeholder-text-dim/40 outline-none focus:border-primary/50 transition-colors"
                                                        />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setExpandedNote(nk)}
                                                        className="flex items-center gap-2 text-xs text-text-dim hover:text-primary transition-colors font-black uppercase tracking-wider"
                                                    >
                                                        <StickyNote size={13} />
                                                        {itemNotes[nk] ? 'Editar nota' : 'Adicionar nota'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Summary */}
                                <div className="mt-8 pt-6 border-t border-border-subtle space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-dim font-bold">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                                        {grandTotal > 0 && (
                                            <span className="font-black text-text-main">{formatPrice(grandTotal)}</span>
                                        )}
                                    </div>
                                    {grandTotal > 0 && (
                                        <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                                            <span className="font-black uppercase tracking-wider text-sm text-text-main">Total estimado</span>
                                            <span className="font-black text-primary text-2xl">{formatPrice(grandTotal)}</span>
                                        </div>
                                    )}
                                    <p className="text-xs text-text-dim opacity-50 font-bold">* O valor final será confirmado pelo restaurante</p>
                                </div>

                                {/* CTA */}
                                <div className="mt-6">
                                    {whatsapp ? (
                                        <button
                                            onClick={sendToWhatsApp}
                                            className="w-full bg-[#25D366] text-white h-[64px] rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-lg hover:bg-[#1ebe5a] hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <MessageCircle size={24} fill="white" />
                                            Finalizar via WhatsApp
                                        </button>
                                    ) : (
                                        <div className="w-full bg-surface border border-border-subtle h-[64px] rounded-2xl flex items-center justify-center text-text-dim text-sm font-bold">
                                            WhatsApp não disponível
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}