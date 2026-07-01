import { useState } from "react";

export default function FlavorWheelModal({ onClose }: { onClose: () => void }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center p-8 transition-opacity duration-300 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[380px] max-w-[90vw] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-[1px] border border-white/30 rounded-3xl p-1.5 flex flex-col justify-center relative animate-in zoom-in fade-in duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onClose();
          }}
          className="absolute -top-3 -right-3 w-8 h-8 bg-black/40 hover:bg-black/60 border border-white/30 backdrop-blur-md text-white rounded-full flex items-center justify-center font-bold shadow-lg transition-colors z-50 text-base"
          aria-label="Close"
        >
          ×
        </button>

        <div 
          className={`w-full flex items-center justify-center bg-black/10 rounded-[22px] border border-white/10 shadow-inner overflow-hidden relative cursor-pointer ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
          onMouseMove={(e) => {
            if (isZoomed) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setZoomOrigin(`${x}% ${y}%`);
            }
          }}
          onMouseLeave={() => {
            if (!isZoomed) setZoomOrigin("center center");
          }}
        >
          <img 
            src="/assets/flavorwheel.jpg" 
            alt="Flavor Wheel" 
            className="w-full max-h-[85vh] h-auto object-contain drop-shadow-2xl transition-transform duration-300 ease-out"
            style={{
              transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
              transformOrigin: zoomOrigin
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
