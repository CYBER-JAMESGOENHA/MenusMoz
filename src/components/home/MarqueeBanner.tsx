import React from 'react';

export const MarqueeBanner: React.FC = () => {
    const marqueeText = " AQUI ENCONTRAS TODA CENA! • RESTAURANTES • BOTTLE STORES • ENTRETENIMENTO • ";
    
    return (
        <div className="marquee-container my-12 border-y border-black/10">
            <div className="marquee-track">
                {/* We repeat the text enough times to cover more than 100% of the width, 
                    and duplicate the entire set for the CSS translateX(-50%) trick. */}
                <div className="marquee-item">
                    <span className="marquee-text">{marqueeText}</span>
                    <span className="marquee-text">{marqueeText}</span>
                    <span className="marquee-text">{marqueeText}</span>
                    <span className="marquee-text">{marqueeText}</span>
                </div>
                <div className="marquee-item">
                    <span className="marquee-text">{marqueeText}</span>
                    <span className="marquee-text">{marqueeText}</span>
                    <span className="marquee-text">{marqueeText}</span>
                    <span className="marquee-text">{marqueeText}</span>
                </div>
            </div>
        </div>
    );
};
