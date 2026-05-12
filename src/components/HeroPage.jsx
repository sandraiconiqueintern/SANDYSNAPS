import { useState } from "react";

const glitchStyle = `
  @keyframes glitch-skew {
    /* glitch burst: 0–50% of 6s = 0–3s */
    0%   { transform: skew(0deg); }
    8%   { transform: skew(-2deg); }
    16%  { transform: skew(0deg); }
    33%  { transform: skew(1.5deg); }
    41%  { transform: skew(0deg); }
    /* calm: 50–100% of 6s = 3–6s */
    50%  { transform: skew(0deg); }
    100% { transform: skew(0deg); }
  }

  @keyframes glitch-clip-1 {
    /* burst: 0–50% */
    0%   { clip-path: inset(40% 0 50% 0); transform: translate(-4px, 0); opacity: 1; }
    10%  { clip-path: inset(70% 0 10% 0); transform: translate(4px, 0);  opacity: 1; }
    20%  { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 0); opacity: 1; }
    30%  { clip-path: inset(55% 0 30% 0); transform: translate(3px, 0);  opacity: 1; }
    40%  { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 0); opacity: 1; }
    /* fade out at 50%, hold invisible through calm */
    50%  { clip-path: inset(50% 0 50% 0); transform: translate(0);        opacity: 0; }
    99%  { clip-path: inset(50% 0 50% 0); transform: translate(0);        opacity: 0; }
    /* reset 1 frame before next burst */
    100% { clip-path: inset(40% 0 50% 0); transform: translate(-4px, 0); opacity: 1; }
  }

  @keyframes glitch-clip-2 {
    /* burst: 0–50% */
    0%   { clip-path: inset(60% 0 20% 0); transform: translate(4px, 0);  opacity: 1; }
    12%  { clip-path: inset(15% 0 65% 0); transform: translate(-4px, 0); opacity: 1; }
    24%  { clip-path: inset(80% 0 5%  0); transform: translate(2px, 0);  opacity: 1; }
    36%  { clip-path: inset(30% 0 45% 0); transform: translate(-2px, 0); opacity: 1; }
    48%  { clip-path: inset(10% 0 70% 0); transform: translate(3px, 0);  opacity: 1; }
    /* fade out at 50% */
    50%  { clip-path: inset(50% 0 50% 0); transform: translate(0);        opacity: 0; }
    99%  { clip-path: inset(50% 0 50% 0); transform: translate(0);        opacity: 0; }
    100% { clip-path: inset(60% 0 20% 0); transform: translate(4px, 0);  opacity: 1; }
  }

  .glitch-wrap {
    position: relative;
    display: inline-block;
    animation: glitch-skew 6s infinite ease-in-out;
  }

  .glitch-wrap::before,
  .glitch-wrap::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    color: inherit;
    pointer-events: none;
  }

  .glitch-wrap::before {
    color: #a8d8e8;
    animation: glitch-clip-1 6s infinite linear;
  }

  .glitch-wrap::after {
    color: #3d7a8a;
    animation: glitch-clip-2 6s infinite linear;
    animation-delay: 0.15s;
  }
`;

export default function HeroPage({ onStart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="hero-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <style>{glitchStyle}</style>

      {/* noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="text-center space-y-4 fade-in z-10 px-6">
        <p
          className="text-lg md:text-3xl tracking-wide"
          style={{ fontFamily: "'Edu TAS Beginner', cursive", color: "#ffffff" }}
        >
          Your story, our Lens.
        </p>

        <h1
          className="brand-title text-5xl md:text-7xl lg:text-8xl select-none glitch-wrap"
          data-text="sandy snaps"
        >
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

      {/* blobs */}
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