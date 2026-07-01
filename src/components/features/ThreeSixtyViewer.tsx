"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import LoadingScreen from "./three-sixty/LoadingScreen";
import SoundToggle from "./three-sixty/SoundToggle";
import FloorSelector from "./three-sixty/FloorSelector";
import FlavorWheelModal from "./three-sixty/FlavorWheelModal";

const SOUND_MAP: Record<string, string> = {
  "/assets/cafe.png": "https://lofi.stream.laut.fm/lofi", 
  "/assets/cafe2.png": "https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/", 
  "/assets/cafe3.png": "https://stream.zeno.fm/0r0xa792kwzuv", 
};

export default function ThreeSixtyViewer() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState("/assets/cafe.png");
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [showFlavorWheel, setShowFlavorWheel] = useState(false);
  const activeHotspotRef = useRef<string | null>(null);
  const flavorWheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedFloor = localStorage.getItem("lastFloor");
    if (savedFloor) {
      setCurrentImage(savedFloor);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastFloor", currentImage);
  }, [currentImage]);

  useEffect(() => {
    if (audioRef.current) {
      const targetSrc = SOUND_MAP[currentImage];
      
      if (audioRef.current.src !== targetSrc) {
        audioRef.current.src = targetSrc;
      }
      
      audioRef.current.loop = true;
      
      if (isSoundOn) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            if (e.name !== "AbortError") {
              console.error("Audio playback failed:", e);
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentImage, isSoundOn]);

  useEffect(() => {
    setIsLoading(true);
    activeHotspotRef.current = null;
    if (flavorWheelTimeoutRef.current) clearTimeout(flavorWheelTimeoutRef.current);
    setShowFlavorWheel(false);
    if (!scriptLoaded || !viewerRef.current || !(window as any).pannellum) {
      return;
    }
    let currentHotspots: any[] = [];

    const handleHotspotClick = (
      hotspotId: string,
      lookAtPitch: number,
      lookAtYaw: number,
      hfov: number = 60,
      isFlavorWheel: boolean = false
    ) => {
      if (!viewerInstanceRef.current) return;
      
      if (activeHotspotRef.current === hotspotId) {
        if (isFlavorWheel) {
          if (flavorWheelTimeoutRef.current) clearTimeout(flavorWheelTimeoutRef.current);
          setShowFlavorWheel(false);
          viewerInstanceRef.current.lookAt(lookAtPitch, lookAtYaw, 120, 1200);
        }
        activeHotspotRef.current = null;
      } else {
        if (isFlavorWheel) {
          viewerInstanceRef.current.lookAt(lookAtPitch, lookAtYaw, hfov, 1200);
          flavorWheelTimeoutRef.current = setTimeout(() => setShowFlavorWheel(true), 1200);
        }
        activeHotspotRef.current = hotspotId;
      }
    };

    if (currentImage === "/assets/cafe.png") {
      currentHotspots = [
        {
          pitch: -7.5,
          yaw: -3.2,
          type: "info",
          text: "Main Bar Counter – The place to order your favorite coffee.",
          clickHandlerFunc: () => handleHotspotClick("bar", -7.5, -3.2)
        },
        {
          pitch: -2.1,
          yaw: 52.5,
          type: "info",
          text: "Roastery Room – Chronicle premium coffee roasting machine.",
          clickHandlerFunc: () => handleHotspotClick("roastery", -2.1, 52.5, 55)
        },
        {
          pitch: -11,
          yaw: 95,
          type: "info",
          text: "Dining Area – A comfortable space to enjoy your meals and coffee.",
          clickHandlerFunc: () => handleHotspotClick("dinning", -11, 95, 55)
        }
      ];
    } else if (currentImage === "/assets/cafe2.png") {
      currentHotspots = [
        {
          pitch: -5,
          yaw: -35,
          type: "info",
          text: "Office Seating Area – A comfortable and productive space for work.",
          clickHandlerFunc: () => handleHotspotClick("seating", -5, -35)
        },
        {
          pitch: -8.33,
          yaw: -160.0,
          type: "info",
          text: "Product Seattle Area – Discover our exclusive merchandise and products.",
          clickHandlerFunc: () => handleHotspotClick("poi_1", -8.33, -160.0)
        },
        {
          pitch: -13,
          yaw: 30,
          type: "info",
          text: "Packaging Area – Where our premium products are carefully prepared.",
          clickHandlerFunc: () => handleHotspotClick("poi_2", -13, 30)
        }
      ];
    } else if (currentImage === "/assets/cafe3.png") {
      currentHotspots = [
        {
          pitch: 6,
          yaw: 0.0,
          type: "info",
          text: "Cupping Room – Where coffee quality and flavors are evaluated.",
          clickHandlerFunc: () => handleHotspotClick("cupping", -5.0, 0.0)
        },
        {
          pitch: 11,
          yaw: -60.0,
          type: "info",
          text: "Flavor Wheel – A tool to help identify and describe coffee flavors.",
          clickHandlerFunc: () => handleHotspotClick("flavorWheel", 11, -60.0, 60, true)
        }
      ];
    }

    const rafId = requestAnimationFrame(() => {
      const container = viewerRef.current;
      if (!container) return;

      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (_) {}
        viewerInstanceRef.current = null;
      }
      container.innerHTML = "";

      try {
        viewerInstanceRef.current = (window as any).pannellum.viewer(container, {
          type: "equirectangular",
          panorama: currentImage,
          autoLoad: true,
          autoRotate: -2,
          showControls: true,
          hotSpotDebug: false,
          hfov: 120,
          hotSpots: currentHotspots
        });

        if (viewerInstanceRef.current && typeof viewerInstanceRef.current.on === 'function') {
          viewerInstanceRef.current.on('load', () => setTimeout(() => setIsLoading(false), 500));
          viewerInstanceRef.current.on('error', () => setTimeout(() => setIsLoading(false), 500));
        } else {
          setTimeout(() => setIsLoading(false), 800);
        }
      } catch (error) {
        console.error("Failed to initialize Pannellum", error);
        setIsLoading(false);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (_) {}
        viewerInstanceRef.current = null;
      }
    };
  }, [scriptLoaded, currentImage]);

  return (
    <div style={{ width: "100%", height: "100%", flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <link rel="stylesheet" href="/pannellum/pannellum.css" />

      <Script
        src="/pannellum/pannellum.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <audio ref={audioRef} />

      <div
        ref={viewerRef}
        className="z-10"
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          overflow: "hidden",
        }}
      />

      <LoadingScreen isLoading={isLoading} />
      <SoundToggle isSoundOn={isSoundOn} onToggle={() => setIsSoundOn(!isSoundOn)} />
      <FloorSelector currentImage={currentImage} onSelect={setCurrentImage} />

      {showFlavorWheel && (
        <FlavorWheelModal 
          onClose={() => {
            if (flavorWheelTimeoutRef.current) clearTimeout(flavorWheelTimeoutRef.current);
            setShowFlavorWheel(false);
            if (viewerInstanceRef.current) {
              viewerInstanceRef.current.lookAt(
                viewerInstanceRef.current.getPitch(),
                viewerInstanceRef.current.getYaw(),
                120,
                1200
              );
              activeHotspotRef.current = null;
            }
          }} 
        />
      )}
    </div>
  );
}