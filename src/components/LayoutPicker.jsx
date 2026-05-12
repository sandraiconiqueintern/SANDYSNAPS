const LAYOUTS = [
  {
    id: "classic",
    label: "Classic Strip",
    desc: "4 photos vertical",
    count: 4,
    icon: (
      <div className="flex flex-col gap-1 w-8">
        {[0,1,2,3].map(i => <div key={i} className="h-4 rounded-sm bg-current opacity-70" />)}
      </div>
    ),
  },
  {
    id: "duo",
    label: "Duo Grid",
    desc: "4 photos 2×2",
    count: 4,
    icon: (
      <div className="grid grid-cols-2 gap-1 w-8">
        {[0,1,2,3].map(i => <div key={i} className="h-4 rounded-sm bg-current opacity-70" />)}
      </div>
    ),
  },
  {
    id: "trio",
    label: "Trio",
    desc: "3 photos vertical",
    count: 3,
    icon: (
      <div className="flex flex-col gap-1 w-8">
        {[0,1,2].map(i => <div key={i} className="h-4 rounded-sm bg-current opacity-70" />)}
      </div>
    ),
  },
];

export default function LayoutPicker({ onSelect }) {
  return (
    <div className="hero-bg min-h-screen flex flex-col items-center justify-center px-6 gap-12">
      <div className="fade-in text-center">
        <h2 className="brand-title text-4xl md:text-8xl mb-4">pick a layout!</h2>
        <p className="text-2sm" style={{ color: "#000000", fontFamily: "Poppins" }}>
          Choose how your photos will be arranged
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onSelect(layout)}
            className="group flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              border: "2px solid rgba(111,163,181,0.3)",
              boxShadow: "0 4px 20px rgba(111,163,181,0.1)",
            }}
          >
            {/* fixed-height icon wrapper */}
            <div
              className="flex items-center justify-center"
              style={{ height: "84px", color: "#6fa3b5" }}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {layout.icon}
              </div>
            </div>

            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: "#3d7a8a", fontFamily: "Poppins" }}>
                {layout.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6fa3b5", fontFamily: "Poppins" }}>
                {layout.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}