import React from 'react';

export const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/2 opacity-20 pointer-events-none" />
        <div className="relative">
            <div className="w-24 h-24 border-[6px] border-primary/10 rounded-[2.5rem] flex items-center justify-center" />
            <div className="absolute inset-0 w-24 h-24 border-[6px] border-primary border-t-transparent rounded-[2.5rem] animate-spin shadow-primary-glow/10" />
        </div>
        <p className="mt-10 text-[10px] font-black uppercase tracking-[0.5em] text-primary italic animate-pulse">A Preparar a Mesa...</p>
    </div>
);

export default LoadingSpinner;
