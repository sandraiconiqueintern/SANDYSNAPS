import { useRef, useState, useEffect } from "react";

const THEMES = [
  { id: "white", label: "White", bg: "#ffffff", text: "#6fa3b5", border: "#dceef5" },
  { id: "blue", label: "Blue", bg: "#c8dfe8", text: "#3d7a8a", border: "#6fa3b5" },
  { id: "blush", label: "Blush", bg: "#fde8e8", text: "#c47a7a", border: "#f0b8b8" },
  { id: "sage", label: "Sage", bg: "#d8eadf", text: "#4a7a5a", border: "#8ab89a" },
  { id: "lavender", label: "Lavender", bg: "#e8e0f0", text: "#6a5a8a", border: "#b8a8d8" },
  { id: "black", label: "Noir", bg: "#1a1a1a", text: "#c8dfe8", border: "#3d7a8a" },
  { id: "cream", label: "Cream", bg: "#faf3e0", text: "#8a6a3a", border: "#d4b87a" },
];

const isInAppBrowser = () => {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Messenger|Line|WhatsApp|Snapchat|Twitter|TikTok/i.test(ua);
};

export default function StripEditor({ photos, layout, filter, onBack, onRestart }) {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState(THEMES[0]);
  const [stripUrl, setStripUrl] = useState(null);
  const [inAppWarning, setInAppWarning] = useState(false);

  const buildStrip = () => {
    const canvas = canvasRef.current;
    if (!canvas || !photos.length) return;

    const ctx = canvas.getContext("2d");
    const PW = 400;
    const PH = Math.round(PW * 0.75);
    const PAD = 12;
    const LABEL_H = 36;
    const STRIP_PAD = 16;

    let canvasW, canvasH;

    if (layout.id === "duo") {
      canvasW = PW * 2 + PAD * 3 + STRIP_PAD * 2;
      canvasH = PH * 2 + PAD * 3 + STRIP_PAD * 2 + LABEL_H;
    } else {
      canvasW = PW + STRIP_PAD * 2;
      const rows = photos.length;
      canvasH = PH * rows + PAD * (rows - 1) + STRIP_PAD * 2 + LABEL_H;
    }

    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvasW, canvasH);

    const filterMap = {
      "filter-warm": "sepia(0.4) saturate(1.3) brightness(1.05)",
      "filter-cool": "hue-rotate(20deg) saturate(0.9) brightness(1.05)",
      "filter-bw": "grayscale(1) contrast(1.1)",
      "filter-vintage": "sepia(0.6) contrast(1.1) brightness(0.9) saturate(0.8)",
      "filter-fade": "brightness(1.1) saturate(0.7) contrast(0.9)",
      "filter-vivid": "saturate(1.8) contrast(1.1)",
    };

    const drawPhoto = (img, x, y, w, h) => {
      if (filterMap[filter]) ctx.filter = filterMap[filter];
      ctx.drawImage(img, x, y, w, h);
      ctx.filter = "none";
    };

    const loadAll = photos.map((src) => new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = src;
    }));

    Promise.all(loadAll).then((imgs) => {
      if (layout.id === "duo") {
        const positions = [
          [STRIP_PAD + PAD, STRIP_PAD],
          [STRIP_PAD + PAD * 2 + PW, STRIP_PAD],
          [STRIP_PAD + PAD, STRIP_PAD + PH + PAD],
          [STRIP_PAD + PAD * 2 + PW, STRIP_PAD + PH + PAD],
        ];
        imgs.forEach((img, i) => {
          if (positions[i]) drawPhoto(img, positions[i][0], positions[i][1], PW, PH);
        });
      } else {
        imgs.forEach((img, i) => {
          drawPhoto(img, STRIP_PAD, STRIP_PAD + i * (PH + PAD), PW, PH);
        });
      }

      ctx.fillStyle = theme.text;
      ctx.font = `bold 18px 'Poppins', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("sandy snaps", canvasW / 2, canvasH - 10);

      setStripUrl(canvas.toDataURL("image/png"));
    });
  };

  useEffect(() => { buildStrip(); }, [theme, photos, layout, filter]);

  const download = (type) => {
    if (!stripUrl) return;

    // In-app browsers (Messenger, Instagram, etc.) block downloads entirely
    if (isInAppBrowser()) {
      setInAppWarning(true);
      return;
    }

    const canvas = canvasRef.current;
    const mimeType = type === "jpg" ? "image/jpeg" : "image/png";
    const quality = type === "jpg" ? 0.92 : undefined;
    const filename = `sandysnaps-strip.${type}`;

    // Use Blob URL — more reliable than toDataURL on iOS Safari
    canvas.toBlob((blob) => {
      if (!blob) return;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    }, mimeType, quality);
  };

  // Caps at 480px for duo grid, 260px for strip — shrinks fluidly below that
  const previewMaxWidth = layout.id === "duo" ? "480px" : "260px";

  return (
    <div className="hero-bg min-h-screen flex flex-col px-4 md:px-12 xl:px-24">

      {/* In-app browser warning modal */}
      {inAppWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4 shadow-2xl"
            style={{ background: "white", border: "1.5px solid rgba(111,163,181,0.3)" }}
          >
            <div className="text-center">
              <p className="text-base font-semibold mb-1" style={{ color: "#3d7a8a", fontFamily: "Poppins" }}>
                Can't download here
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#6fa3b5", fontFamily: "Poppins" }}>
                You're using an in-app browser (Messenger, Instagram, etc.) which blocks downloads.
              </p>
              <p className="text-sm font-medium mt-3" style={{ color: "#3d7a8a", fontFamily: "Poppins" }}>
                Tap <strong>···</strong> or <strong>⋮</strong> → <strong>Open in Browser</strong>, then download from there.
              </p>
            </div>
            <button
              onClick={() => setInAppWarning(false)}
              className="btn-primary px-6 py-2.5 text-sm tracking-wide transition-all hover:scale-105 active:scale-95 w-full"
              style={{ background: "#6fa3b5", color: "white", borderRadius: "20px" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="fade-in text-center pt-10 pb-6 md:pb-0">
        <h2 className="brand-title text-4xl md:text-8xl">style it</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center mt-6 md:mt-2 mb-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 xl:gap-16 w-full max-w-6xl mx-auto items-center justify-center ">

          {/* Left: color picker */}
          <div className="w-full max-w-xs md:w-72 flex-shrink-0">
            <p className="text-sm font-medium mb-4 text-center md:text-left" style={{ color: "#6fa3b5", fontFamily: "Poppins" }}>
              Pick the color theme for your strip!
            </p>
            <div
              className="flex flex-wrap gap-2 p-4 rounded-2xl justify-center md:justify-start"
              style={{
                background: "rgba(200,223,232,0.5)",
                backdropFilter: "blur(12px)",
                border: "1.5px solid rgba(111,163,181,0.3)",
              }}
            >
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{
                    background: theme.id === t.id ? "rgba(111,163,181,0.25)" : "transparent",
                    border: theme.id === t.id ? "2px solid #6fa3b5" : "2px solid transparent",
                  }}
                >
                  <div className="w-7 h-7 rounded-full border-2" style={{ background: t.bg, borderColor: t.border }} />
                  <span className="text-xs btn-primary" style={{ color: "#3d7a8a" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Center: strip preview — fluid, shrinks with viewport */}
          <div className="flex items-center justify-center flex-1 min-w-0 px-2">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl fade-in w-full"
              style={{
                background: theme.bg,
                border: `3px solid ${theme.border}`,
                maxWidth: previewMaxWidth,
                maxHeight: "calc(100vh - 200px)",
              }}
            >
              <canvas ref={canvasRef} className="w-full h-auto" style={{ display: "block" }} />
            </div>
          </div>

          {/* Right: download + actions */}
          <div className="w-full max-w-xs md:w-52 flex-shrink-0 flex flex-col gap-8 items-center md:items-start">
            <div className="w-full">
              <p className="text-sm font-semibold mb-3 text-center md:text-left" style={{ color: "#3d7a8a", fontFamily: "Poppins" }}>
                Download
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => download("png")}
                  className="btn-primary px-6 py-2.5 text-sm tracking-wide transition-all hover:scale-105 active:scale-95 w-full"
                  style={{ background: "#6fa3b5", color: "white", boxShadow: "0 4px 16px rgba(111,163,181,0.4)", borderRadius: "20px" }}
                >
                  PNG
                </button>
                <button
                  onClick={() => download("jpg")}
                  className="btn-primary px-6 py-2.5 text-sm tracking-wide transition-all hover:scale-105 active:scale-95 w-full"
                  style={{ background: "#3d7a8a", color: "white", boxShadow: "0 4px 16px rgba(61,122,138,0.4)", borderRadius: "20px" }}
                >
                  JPG
                </button>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm font-semibold mb-3 text-center md:text-left" style={{ color: "#3d7a8a", fontFamily: "Poppins" }}>
                All done?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={onBack}
                  className="btn-primary px-6 py-2.5 text-sm tracking-wide transition-all hover:scale-105 active:scale-95 w-full"
                  style={{ background: "rgba(255,255,255,0.7)", color: "#6fa3b5", border: "1.5px solid rgba(111,163,181,0.4)", borderRadius: "20px" }}
                >
                  Retake
                </button>
                <button
                  onClick={onRestart}
                  className="btn-primary px-6 py-2.5 text-sm tracking-wide transition-all hover:scale-105 active:scale-95 w-full"
                  style={{ background: "rgba(255,255,255,0.7)", color: "#6fa3b5", border: "1.5px solid rgba(111,163,181,0.4)", borderRadius: "20px" }}
                >
                  New Session
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}