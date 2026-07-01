import ThreeSixtyViewer from "@/components/features/ThreeSixtyViewer";

export default function HomePage() {
  return (
    <main className="h-screen bg-white flex flex-col">
      <div className="w-full flex-1 bg-white flex flex-col">
        
        <ThreeSixtyViewer />
        
      </div>
    </main>
  );
}