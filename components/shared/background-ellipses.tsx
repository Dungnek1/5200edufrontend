"use client";

export function BackgroundEllipses() {
  return (
    <div className="absolute pointer-events-none ellipse-container" style={{ overflow: "visible", zIndex: 0, top: 0, left: 0, right: 0, width: "100vw", height: "100%", marginLeft: "calc(-50vw + 50%)" }}>
      <div className="absolute top-0 left-0 max-[667px]:w-[150px] max-[667px]:h-[150px] max-[667px]:opacity-50 max-[667px]:blur-2xl -left-[80px] md:-left-[150px] lg:-left-[200px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] opacity-60 md:opacity-70 rounded-full blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.8) 0%, rgba(163, 230, 255, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)", zIndex: 0 }} />
      <div className="absolute top-[300px] md:top-[400px] lg:top-[450px] right-0 max-[667px]:w-[120px] max-[667px]:h-[120px] max-[667px]:opacity-50 max-[667px]:blur-2xl -right-[80px] md:-right-[200px] lg:-right-[300px] w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] opacity-60 md:opacity-70 rounded-full blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.8) 0%, rgba(163, 230, 255, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)", zIndex: 0 }} />
      <div className="absolute top-[500px] md:top-[550px] lg:top-[600px] right-0 max-[667px]:w-[180px] max-[667px]:h-[140px] max-[667px]:opacity-40 max-[667px]:blur-2xl -right-[100px] md:-right-[300px] lg:-right-[400px] w-[450px] h-[400px] md:w-[700px] md:h-[600px] lg:w-[1000px] lg:h-[800px] opacity-50 md:opacity-60 rounded-full blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.7) 0%, rgba(163, 230, 255, 0.5) 50%, rgba(255, 255, 255, 0.85) 100%)", zIndex: 0 }} />
    </div>
  );
}
