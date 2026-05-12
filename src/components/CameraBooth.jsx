{/* CameraBooth.jsx - React component for camera interface with countdown, filters, and photo capture */}
import { useEffect, useState, useCallback } from "react";
import { useCamera } from "../hooks/useCamera";

const FILTERS = [
  { id: "filter-none", label: "None" },
  { id: "filter-warm", label: "Warm" },
  { id: "filter-cool", label: "Cool" },
  { id: "filter-bw", label: "B&W" },
  { id: "filter-vintage", label: "Vintage" },
  { id: "filter-fade", label: "Fade" },
  { id: "filter-vivid", label: "Vivid" },
];

function playShutterSound() {
  try {
    const audio = new Audio("/sounds/shutter.mp3");
    audio.play();
  } catch (_) {}
}

function countdownStyle(val) {
  if (val === "Get ready!")
    return { fontFamily: "Edu TAS Beginner, cursive", fontSize: "2.2rem", fontWeight: 500 };
  if (val === "SNAP")
    return { fontFamily: "Rubik Glitch, cursive", fontSize: "3.5rem" };
  return { fontFamily: "Poppins, sans-serif", fontSize: "6rem", fontWeight: 700 };
}

export default function CameraBooth({ layout, onDone }) {
const { videoRef, hasPermission, error, facingMode, startCamera, flipCamera, capturePhoto } = useCamera();
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [countKey, setCountKey] = useState(0);
  const [flash, setFlash] = useState(false);
  const [isShooting, setIsShooting] = useState(false);
  const [filter, setFilter] = useState("filter-none");
  const [shootHovered, setShootHovered] = useState(false);
  const photoTarget = layout.count;

  useEffect(() => {
    startCamera("user");
  }, [startCamera]);

  const doCountdown = useCallback(() => {
    return new Promise((resolve) => {
      setCountdown("Get ready!");
      setCountKey((k) => k + 1);
      setTimeout(() => {
        let n = 3;
        setCountdown(n);
        setCountKey((k) => k + 1);
        const iv = setInterval(() => {
          n--;
          if (n === 0) {
            clearInterval(iv);
            setCountdown("SNAP");
            setCountKey((k) => k + 1);
            setTimeout(resolve, 600);
          } else {
            setCountdown(n);
            setCountKey((k) => k + 1);
          }
        }, 1000);
      }, 1200);
    });
  }, []);

  const shoot = useCallback(async () => {
    if (isShooting || photos.length >= photoTarget) return;
    setIsShooting(true);

    for (let i = 0; i < photoTarget; i++) {
      await doCountdown();
      playShutterSound();
      setFlash(true);
      const img = capturePhoto(filter);
      setPhotos((prev) => [...prev, img]);
      setTimeout(() => setFlash(false), 400);
      if (i < photoTarget - 1) await new Promise((r) => setTimeout(r, 800));
    }

    setCountdown(null);
    setIsShooting(false);
  }, [isShooting, photos.length, photoTarget, doCountdown, capturePhoto, filter]);

  const retake = () => {
    setPhotos([]);
    setIsShooting(false);
    setCountdown(null);
  };

  return (
    <div className="hero-bg min-h-screen flex flex-col items-center px-4 py-12">
      {/* header */}
      <div className="fade-in text-center mb-10">
        <h2 className="brand-title text-4xl md:text-8xl">pose and take photos</h2>
        <p className="text-xs mt-2" style={{ color: "#6fa3b5", fontFamily: "Poppins" }}>
          {photos.length}/{photoTarget} captured · {layout.label}
        </p>
      </div>

      {/* camera */}
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio: "4/3", background: "#c8dfe8" }}>
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <p className="text-sm font-semibold" style={{ color: "#3d7a8a" }}>Camera access denied</p>
              <p className="text-xs mt-1" style={{ color: "#6fa3b5" }}>{error}</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${filter}`}
            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
          />
        )}

        {/* countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.38)" }}>
            <span
              key={countKey}
              className="count-anim"
              style={{
                ...countdownStyle(countdown),
                color: "white",
                textShadow: "0 0 24px rgba(111,163,181,0.9)",
              }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* flash */}
        {flash && <div className="snap-flash absolute inset-0 bg-white pointer-events-none" />}

        {/* flip btn */}
        <button
          onClick={flipCamera}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)", color: "#3d7a8a", fontFamily: "Poppins" }}
        >
          Flip
        </button>

        {/* photo count pills */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: photoTarget }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{ background: i < photos.length ? "#6fa3b5" : "rgba(255,255,255,0.5)" }}
            />
          ))}
        </div>
      </div>

      {/* filter row */}
      <div className="flex gap-2 mt-7 overflow-x-auto pb-1 w-full max-w-md">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all duration-200 btn-primary"
            style={{
              background: filter === f.id ? "#6fa3b5" : "rgba(255,255,255,0.6)",
              color: filter === f.id ? "white" : "#3d7a8a",
              border: "1.5px solid rgba(111,163,181,0.4)",
              backdropFilter: "blur(6px)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* actions */}
      <div className="flex gap-4 mt-9">
        {photos.length < photoTarget && !isShooting && (
          <button
            onClick={shoot}
            disabled={!hasPermission}
            onMouseEnter={() => setShootHovered(true)}
            onMouseLeave={() => setShootHovered(false)}
            className="btn-primary px-10 py-3 text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{
              background: shootHovered ? "#62858E" : "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "20px",
            }}
          >
            {photos.length === 0 ? "Start Shoot" : `Next (${photos.length}/${photoTarget})`}
          </button>
        )}

        {photos.length > 0 && !isShooting && (
          <button
            onClick={retake}
            className="btn-primary px-6 py-3 text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "#6fa3b5",
              border: "1.5px solid rgba(111,163,181,0.4)",
              borderRadius: "20px",
            }}
          >
            Retake
          </button>
        )}

        {photos.length === photoTarget && (
          <button
            onClick={() => onDone(photos, filter)}
            className="btn-primary px-8 py-3 text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "#3d7a8a",
              color: "white",
              boxShadow: "0 4px 16px rgba(61,122,138,0.4)",
              borderRadius: "20px",
            }}
          >
            Next
          </button>
        )}
      </div>

      {/* thumbnail row */}
      {photos.length > 0 && (
        <div className="flex gap-3 mt-9 flex-wrap justify-center max-w-md">
          {photos.map((p, i) => (
            <div key={i} className="relative fade-in">
              <img src={p} alt={`Photo ${i + 1}`} className="w-16 h-12 object-cover rounded-lg" style={{ border: "2px solid rgba(111,163,181,0.5)" }} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#6fa3b5", fontSize: "9px" }}>{i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
