export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      style={{ zIndex: 9999 }}
      className={`absolute inset-0 flex items-center justify-center bg-white transition-opacity duration-300 ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Loading..." className="w-96 h-96 object-contain animate-pulse" />
      </div>
    </div>
  );
}
