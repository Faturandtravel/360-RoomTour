export default function SoundToggle({ isSoundOn, onToggle }: { isSoundOn: boolean, onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-8 right-8 z-10 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg text-white rounded-full font-semibold hover:bg-black/60 transition-all duration-300 flex items-center gap-2"
    >
      {isSoundOn ? (
        <>
          <span>🔊</span> Sound On
        </>
      ) : (
        <>
          <span>🔇</span> Sound Off
        </>
      )}
    </button>
  );
}
