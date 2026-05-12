import { useState } from "react";

export default function HeroPage({ onStart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="hero-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="text-center space-y-4 fade-in z-10 px-6">
        <p className="brand-sub text-lg md:text-3xl tracking-wide" style={{ color: "#ffffff" }}>
          Your story, our Lens.
        </p>

        <h1 className="brand-title text-5xl md:text-7xl lg:text-8xl select-none">
          sandy snaps
        </h1>

        <div className="pt-4">
          <button
            onClick={onStart}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="btn-primary px-12 py-3 text-sm md:text-base tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: hovered ? "#62858E" : "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "20px",
            }}
          >
            start
          </button>
        </div>
      </div>

      {/* decorative blobs */}
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6fa3b5, transparent)" }}
      />
      <div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #b8d4de, transparent)" }}
      />
    </div>
  );
}
