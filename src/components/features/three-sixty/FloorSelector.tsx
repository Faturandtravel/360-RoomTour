export default function FloorSelector({ currentImage, onSelect }: { currentImage: string, onSelect: (image: string) => void }) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
      <button 
        onClick={() => onSelect("/assets/cafe.png")}
        className={`px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 backdrop-blur-xl border ${currentImage === "/assets/cafe.png" ? "bg-black/70 border-white/30 text-white scale-105" : "bg-black/40 border-white/10 text-white hover:bg-black/60"}`}
      >
        Floor 1
      </button>
      <button 
        onClick={() => onSelect("/assets/cafe2.png")}
        className={`px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 backdrop-blur-xl border ${currentImage === "/assets/cafe2.png" ? "bg-black/70 border-white/30 text-white scale-105" : "bg-black/40 border-white/10 text-white hover:bg-black/60"}`}
      >
        Floor 2
      </button>
      <button 
        onClick={() => onSelect("/assets/cafe3.png")}
        className={`px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 backdrop-blur-xl border ${currentImage === "/assets/cafe3.png" ? "bg-black/70 border-white/30 text-white scale-105" : "bg-black/40 border-white/10 text-white hover:bg-black/60"}`}
      >
        Floor 3
      </button>
    </div>
  );
}
