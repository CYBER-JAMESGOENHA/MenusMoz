import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft, StickyNote, CheckCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../context/CartContext';
import { translations } from '../translations';

interface CartPageProps {
    lang: string;
}

export default function CartPage({ lang }: CartPageProps) {
    const { cart, addToCart, removeFromCart, clearCart, totalItems, grandTotal, restaurantName, whatsapp, itemNotes, setItemNote } = useCart();
    const navigate = useNavigate();
    const [expandedNote, setExpandedNote] = useState<string | null>(null);
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
        <div className="min-h-screen bg-bg pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-36 lg:pb-12">
            <Helmet>
                <title>O Seu Pedido — Locais de Moz</title>
            </Helmet>

            {/* Back button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-dim hover:text-primary transition-colors text-xs sm:text-sm font-black uppercase tracking-wider group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar
                </button>
            </div>

            {/* Success State */}
            {showSuccess ? (
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-black italic uppercase tracking-tighter text-text-main">Pedido Enviado!</h3>
                            <p className="text-text-dim text-sm mt-2">A redirecionar para o WhatsApp do restaurante...</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Empty State */}
                    {cart.length === 0 ? (
                        <div className="max-w-2xl mx-auto px-4">
                            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                <div className="w-20 h-20 bg-surface rounded-3xl border border-border-subtle flex items-center justify-center text-4xl mb-2">
                                    🛒
                                </div>
                                <div>
                                    <p className="font-black text-text-main uppercase tracking-tight text-xl">Carrinho vazio</p>
                                    <p className="text-text-dim text-sm mt-1">Adicione itens do menu para começar</p>
                                </div>
                                <Link
                                    to="/restaurantes"
                                    className="mt-2 px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-premium"
                                >
                                    Explorar Restaurantes
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Desktop Header - full width */}
                            <div className="hidden lg:flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-5xl font-display font-black italic uppercase tracking-tighter text-text-main">
                                        O Seu Pedido
                                    </h1>
                                    {restaurantName && (
                                        <p className="text-text-dim text-xs font-black uppercase tracking-widest mt-2 opacity-60">
                                            em {restaurantName}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-text-dim/60">
                                        <ShoppingBag size={16} />
                                        <span className="text-sm font-black">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                                    </div>
                                    <button
                                        onClick={clearCart}
                                        className="h-10 px-5 rounded-2xl bg-surface border border-border-subtle text-text-dim hover:text-red-500 hover:border-red-200 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Limpar Tudo
                                    </button>
                                </div>
                            </div>

                            {/* Mobile & Tablet Header */}
                            <div className="lg:hidden mb-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black italic uppercase tracking-tighter text-text-main">
                                    O Seu Pedido
                                </h1>
                                {restaurantName && (
                                    <p className="text-text-dim text-xs sm:text-sm font-black uppercase tracking-widest mt-1.5 opacity-60">
                                        em {restaurantName}
                                    </p>
                                )}
                            </div>

                            {/* Two-column layout for desktop */}
                            <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-16">

                                {/* ── LEFT COLUMN: Items List ─────────────────────── */}
                                <div className="flex-1 lg:min-w-0">

                                    {/* Mobile/Tablet Clear button */}
                                    <div className="flex justify-end mb-4 lg:hidden">
                                        <button
                                            onClick={clearCart}
                                            className="h-9 px-4 rounded-xl bg-surface border border-border-subtle text-text-dim hover:text-red-500 hover:border-red-200 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Limpar Tudo
                                        </button>
                                    </div>

                                    {/* Items */}
                                    <div className="bg-surface rounded-[2.5rem] lg:rounded-[3rem] border border-border-subtle shadow-premium overflow-hidden">
                                        <div className="divide-y divide-border-subtle/40">
                                            {cart.map((item, i) => {
                                                const nk = noteKey(item.name, item.categoryName);
                                                const isNoteOpen = expandedNote === nk;
                                                return (
                                                    <div key={i} className="p-4 sm:p-5 md:p-6 lg:p-8">
                                                        {/* Item Row */}
                                                        <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                                                            {/* Thumbnail */}
                                                            {item.image_url && (
                                                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 border border-border-subtle bg-bg">
                                                                    <img src={item.image_url} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}

                                                            {/* Info */}
                                                            <div className="flex-1 min-w-0 py-1">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="min-w-0">
                                                                        <span className="font-black text-text-main block leading-snug text-base sm:text-lg md:text-xl">{item.name}</span>
                                                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-text-dim opacity-50 mt-0.5 block">{item.categoryName}</span>
                                                                    </div>
                                                                    <span className="font-black text-primary text-base sm:text-lg md:text-xl shrink-0">{item.price}</span>
                                                                </div>

                                                                {/* Note preview */}
                                                                {itemNotes[nk] && !isNoteOpen && (
                                                                    <p className="text-xs sm:text-sm text-text-dim mt-2 italic line-clamp-1">📝 {itemNotes[nk]}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Bottom Row: Note toggle + Qty */}
                                                        <div className="flex items-center justify-between mt-4 sm:mt-5 ml-0 md:ml-[calc(6rem+1.25rem)]">
                                                            {/* Note toggle */}
                                                            <div>
                                                                {isNoteOpen ? (
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Ex: sem cebola, bem passado..."
                                                                        value={itemNotes[nk] || ''}
                                                                        onChange={e => setItemNote(nk, e.target.value)}
                                                                        onBlur={() => setExpandedNote(null)}
                                                                        autoFocus
                                                                        className="text-xs sm:text-sm bg-bg border border-border-subtle rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-text-main placeholder-text-dim/40 outline-none focus:border-primary/50 transition-colors w-40 sm:w-52 md:w-64"
                                                                    />
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setExpandedNote(nk)}
                                                                        className="flex items-center gap-1.5 text-[10px] sm:text-xs text-text-dim hover:text-primary transition-colors font-black uppercase tracking-wider"
                                                                    >
                                                                        <StickyNote size={13} />
                                                                        {itemNotes[nk] ? 'Editar nota' : 'Adicionar nota'}
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center gap-1.5 sm:gap-2 bg-bg rounded-xl p-1 sm:p-1.5 border border-border-subtle shadow-sm">
                                                                <button
                                                                    onClick={() => removeFromCart(item.name, item.categoryName)}
                                                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                                                                >
                                                                    {item.qty === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                                                                </button>
                                                                <span className="w-6 sm:w-7 text-center font-black text-sm sm:text-base">{item.qty}</span>
                                                                <button
                                                                    onClick={() => addToCart({ name: item.name, price: item.price, categoryName: item.categoryName, image_url: item.image_url })}
                                                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all"
                                                                >
                                                                    <Plus size={13} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Subtotal per item (desktop) */}
                                                        <div className="hidden lg:flex justify-end mt-3">
                                                            <span className="text-sm text-text-dim">
                                                                Subtotal: <span className="font-black text-text-main">{formatPrice(parseFloat(item.price.replace(/[^\d,.]/g, '').replace(',', '.')) * item.qty)} MZN</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Continue Shopping */}
                                    <div className="mt-4 hidden lg:block">
                                        <Link
                                            to="/restaurantes"
                                            className="text-xs font-black uppercase tracking-widest text-text-dim hover:text-primary transition-colors flex items-center gap-2"
                                        >
                                            ← Continuar a explorar
                                        </Link>
                                    </div>
                                </div>

                                {/* ── RIGHT COLUMN: Order Summary (Desktop only) ── */}
                                <div className="hidden lg:block w-[380px] xl:w-[420px] shrink-0">
                                    <div className="sticky top-32">
                                        <div className="bg-surface rounded-[3rem] border border-border-subtle shadow-premium overflow-hidden">
                                            {/* Header */}
                                            <div className="p-8 border-b border-border-subtle bg-primary/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                        <Sparkles size={18} />
                                                    </div>
                                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary italic">Resumo do Pedido</h3>
                                                </div>
                                            </div>

                                            {/* Items breakdown */}
                                            <div className="p-8 space-y-4">
                                                {cart.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <span className="w-6 h-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
                                                                {item.qty}
                                                            </span>
                                                            <span className="text-sm font-bold text-text-main truncate">{item.name}</span>
                                                        </div>
                                                        <span className="text-sm font-black text-text-dim shrink-0">
                                                            {formatPrice(parseFloat(item.price.replace(/[^\d,.]/g, '').replace(',', '.')) * item.qty)} MZN
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Divider */}
                                            <div className="mx-8 h-px bg-border-subtle/40" />

                                            {/* Totals */}
                                            <div className="p-8 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-text-dim font-bold">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                                                    {grandTotal > 0 && (
                                                        <span className="font-black text-text-main">{formatPrice(grandTotal)} MZN</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                                                    <span className="font-black uppercase tracking-wider text-sm text-text-main">Total estimado</span>
                                                    <span className="font-black text-primary text-2xl">{formatPrice(grandTotal)} MZN</span>
                                                </div>
                                                <p className="text-[10px] text-text-dim opacity-50 font-bold">* O valor final será confirmado pelo restaurante</p>
                                            </div>

                                            {/* CTA */}
                                            <div className="p-8 pt-0">
                                                {whatsapp ? (
                                                    <button
                                                        onClick={sendToWhatsApp}
                                                        className="w-full bg-[#25D366] text-white h-[64px] rounded-2xl flex items-center justify-center gap-3 font-black text-base shadow-lg hover:bg-[#1ebe5a] hover:scale-[1.02] active:scale-95 transition-all"
                                                    >
                                                        <MessageCircle size={22} fill="white" />
                                                        Finalizar via WhatsApp
                                                    </button>
                                                ) : (
                                                    <div className="w-full bg-bg border border-border-subtle h-[64px] rounded-2xl flex items-center justify-center text-text-dim text-sm font-bold">
                                                        WhatsApp não disponível
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Trust badges */}
                                        <div className="mt-6 text-center">
                                            <p className="text-[10px] text-text-dim/40 font-black uppercase tracking-widest">
                                                Pagamento seguro · Entrega confirmada via WhatsApp
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Mobile/Tablet Summary + CTA (below items) */}
                            <div className="lg:hidden mt-6 space-y-4">
                                {/* Summary */}
                                <div className="bg-surface rounded-[2.5rem] p-5 sm:p-6 border border-border-subtle shadow-premium">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-text-dim font-bold text-sm">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                                        {grandTotal > 0 && (
                                            <span className="font-black text-text-main">{formatPrice(grandTotal)} MZN</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                                        <span className="font-black uppercase tracking-wider text-xs sm:text-sm text-text-main">Total estimado</span>
                                        <span className="font-black text-primary text-xl sm:text-2xl">{formatPrice(grandTotal)} MZN</span>
                                    </div>
                                    <p className="text-[10px] text-text-dim opacity-50 font-bold mt-2">* O valor final será confirmado pelo restaurante</p>
                                </div>

                                {/* CTA */}
                                <div>
                                    {whatsapp ? (
                                        <button
                                            onClick={sendToWhatsApp}
                                            className="w-full bg-[#25D366] text-white h-[60px] sm:h-[64px] rounded-2xl flex items-center justify-center gap-3 font-black text-base sm:text-lg shadow-lg hover:bg-[#1ebe5a] hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <MessageCircle size={22} fill="white" />
                                            Finalizar via WhatsApp
                                        </button>
                                    ) : (
                                        <div className="w-full bg-surface border border-border-subtle h-[60px] sm:h-[64px] rounded-2xl flex items-center justify-center text-text-dim text-sm font-bold">
                                            WhatsApp não disponível
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}