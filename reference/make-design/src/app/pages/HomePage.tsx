import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { NavLink } from "react-router";
import { ArrowRight, Play, TrendingUp, Globe, Zap, Users } from "lucide-react";

const STATS = [
  { value: "1B+", label: "Monthly Active Users" },
  { value: "150+", label: "Markets Worldwide" },
  { value: "3.8×", label: "Average ROAS" },
  { value: "40%", label: "Lower CPM" },
];

const SHORTCUTS = [
  { label: "Ad Solutions", desc: "Every format for every goal", to: "/solutions", color: "#fe2c55", Icon: Zap },
  { label: "Platform Tools", desc: "AI, pixel, creative studio", to: "/products", color: "#25f4ee", Icon: TrendingUp },
  { label: "Audience Insights", desc: "Data, trends, signals", to: "/insights", color: "#7c3aed", Icon: Globe },
  { label: "Case Studies", desc: "Real results, real brands", to: "/cases", color: "#ff6b35", Icon: Users },
];

// Simplified continent outlines [lat, lng]
const CONTINENTS: [number, number][][] = [
  // Africa
  [
    [37,-6],[36,-2],[37,10],[33,12],[31,25],[30,33],[22,38],[15,42],
    [12,44],[11,51],[2,42],[-1,41],[-4,40],[-10,40],[-17,37],
    [-26,33],[-34,26],[-35,19],[-29,17],[-23,14],[-18,12],[-10,13],
    [-5,10],[4,8],[5,2],[4,9],[3,11],[5,15],[14,15],[15,18],
    [23,15],[25,10],[24,3],[28,-1],[30,5],[32,28],[31,34],[37,-6],
  ],
  // Eurasia (Europe + Asia as one mass)
  [
    [36,-9],[38,-9],[44,-8],[44,0],[44,3],[41,2],[38,0],[36,-5],
    [36,5],[37,10],[38,15],[37,15],[38,13],[41,16],[42,19],[42,22],
    [40,23],[37,25],[36,28],[37,36],[42,42],[42,45],[42,50],[43,51],
    [44,50],[48,47],[50,45],[54,42],[57,40],[60,30],[65,30],
    [69,30],[71,35],[71,50],[70,60],[68,65],[66,70],[70,80],
    [72,105],[72,140],[68,170],[62,165],[55,140],[52,142],
    [45,135],[42,130],[40,125],[35,120],[25,120],[22,115],
    [20,110],[10,105],[3,103],[1,104],[5,100],[10,99],
    [15,100],[20,100],[23,98],[26,92],[23,90],[20,87],
    [15,80],[8,78],[8,77],[10,76],[12,79],[20,73],
    [23,68],[24,63],[25,58],[22,57],[22,50],[24,46],
    [27,41],[30,32],[31,34],[33,36],[36,36],[37,37],
    [37,42],[38,44],[41,45],[43,45],[43,50],[47,51],
    [52,55],[54,60],[58,65],[62,68],[65,68],[68,65],
    [69,60],[70,65],[72,75],[60,30],[55,38],[52,40],
    [48,45],[45,40],[42,45],[36,28],[36,-9],
  ],
  // North America
  [
    [71,-157],[68,-166],[64,-168],[60,-147],[58,-137],[55,-130],
    [49,-125],[38,-123],[34,-120],[23,-110],[20,-105],[16,-97],
    [15,-93],[10,-84],[9,-79],[9,-77],[11,-73],[13,-71],
    [26,-80],[31,-81],[35,-75],[40,-72],[42,-70],[44,-66],
    [47,-53],[52,-55],[58,-64],[62,-64],[64,-64],[68,-53],
    [72,-60],[76,-65],[80,-65],[83,-55],[80,-55],[76,-72],
    [74,-80],[72,-96],[70,-110],[71,-130],[71,-157],
  ],
  // South America
  [
    [12,-72],[12,-63],[11,-62],[8,-60],[6,-58],[4,-53],
    [4,-51],[2,-51],[0,-50],[-5,-35],[-8,-35],[-10,-37],
    [-15,-39],[-23,-43],[-30,-50],[-35,-57],[-38,-62],
    [-55,-65],[-55,-68],[-52,-70],[-45,-66],[-40,-62],
    [-35,-57],[-23,-70],[-18,-70],[-5,-81],[0,-80],[5,-77],
    [8,-77],[12,-72],
  ],
  // Australia
  [
    [-14,130],[-14,136],[-12,136],[-12,142],[-15,145],
    [-18,147],[-24,152],[-30,153],[-34,151],[-38,147],
    [-38,140],[-35,137],[-32,134],[-33,115],[-26,113],
    [-22,114],[-18,122],[-16,123],[-14,127],[-14,130],
  ],
  // Greenland
  [
    [76,-65],[72,-22],[70,-24],[65,-37],[62,-42],[60,-44],
    [64,-52],[68,-53],[72,-60],[76,-65],
  ],
];

const CITIES = [
  { lat: 51.5,  lng: -0.1,   hot: true  },
  { lat: 40.7,  lng: -74.0,  hot: true  },
  { lat: 35.7,  lng: 139.7,  hot: true  },
  { lat: 37.6,  lng: 126.9,  hot: true  },
  { lat: 1.35,  lng: 103.8,  hot: true  },
  { lat: -33.9, lng: 151.2,  hot: false },
  { lat: 48.9,  lng: 2.3,    hot: false },
  { lat: 52.5,  lng: 13.4,   hot: false },
  { lat: 25.2,  lng: 55.3,   hot: true  },
  { lat: 19.1,  lng: 72.9,   hot: false },
  { lat: -23.5, lng: -46.6,  hot: true  },
  { lat: 34.1,  lng: -118.2, hot: false },
  { lat: 43.7,  lng: -79.4,  hot: false },
  { lat: 6.5,   lng: 3.4,    hot: false },
  { lat: -26.2, lng: 28.0,   hot: false },
  { lat: 55.8,  lng: 37.6,   hot: false },
  { lat: 39.9,  lng: 116.4,  hot: false },
  { lat: -6.2,  lng: 106.8,  hot: false },
  { lat: 24.7,  lng: 46.7,   hot: false },
  { lat: 19.4,  lng: -99.1,  hot: false },
];

const CONNECTIONS = [
  [0,1],[0,6],[0,8],[1,10],[1,11],[2,3],[2,4],
  [3,4],[4,7],[5,4],[8,9],[8,2],[0,15],[10,13],
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function project(lat: number, lng: number, rotY: number, cx: number, cy: number, r: number) {
  const phi = toRad(90 - lat);
  const theta = toRad(lng) + rotY;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);
  return { x: cx + x, y: cy - y, z };
}

function RotatingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const rotRef = useRef<number>(0);
  const arcProgress = useRef<number[]>(CONNECTIONS.map(() => 0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const r = Math.min(W, H) * 0.38;
      if (r < 10) return; // canvas not yet laid out
      const rot = rotRef.current;

      // ── Outer atmosphere halo ─────────────────────────────────
      const halo = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.18);
      halo.addColorStop(0, "rgba(80,160,255,0.08)");
      halo.addColorStop(0.5, "rgba(60,120,220,0.04)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2);
      ctx.fill();

      // ── Globe clipping region ─────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // Ocean base — deep navy with subtle depth shading
      const ocean = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
      ocean.addColorStop(0, "#0d2240");
      ocean.addColorStop(0.6, "#071428");
      ocean.addColorStop(1, "#030a14");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Latitude lines (inside sphere)
      for (let lat = -75; lat <= 75; lat += 30) {
        const phi = toRad(90 - lat);
        const ringR = r * Math.sin(phi);
        const ringY = cy - r * Math.cos(phi);
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const theta = (i / 120) * Math.PI * 2 + rot;
          const sx = cx + ringR * Math.cos(theta);
          const sz = ringR * Math.sin(theta);
          if (i === 0) ctx.moveTo(sx, ringY);
          else ctx.lineTo(sx, ringY);
        }
        ctx.strokeStyle = "rgba(100,160,220,0.07)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      for (let lng = 0; lng < 360; lng += 30) {
        const theta = toRad(lng) + rot;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const phi = (i / 60) * Math.PI;
          const x = cx + r * Math.sin(phi) * Math.cos(theta);
          const y = cy - r * Math.cos(phi);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(100,160,220,0.07)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Continent fills ───────────────────────────────────────
      CONTINENTS.forEach((coords) => {
        ctx.beginPath();
        let penDown = false;
        for (const [lat, lng] of coords) {
          const p = project(lat, lng, rot, cx, cy, r);
          if (p.z < 0) { penDown = false; continue; }
          if (!penDown) { ctx.moveTo(p.x, p.y); penDown = true; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        // Land fill — depth-shaded warm green-gray
        const landGrad = ctx.createRadialGradient(cx - r * 0.15, cy - r * 0.15, 0, cx, cy, r);
        landGrad.addColorStop(0, "rgba(72,105,72,0.95)");
        landGrad.addColorStop(0.7, "rgba(50,78,52,0.90)");
        landGrad.addColorStop(1, "rgba(30,50,32,0.85)");
        ctx.fillStyle = landGrad;
        ctx.fill();
        // Coastline
        ctx.strokeStyle = "rgba(100,150,105,0.35)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // Sphere terminator — dark side shadow
      const shadow = ctx.createRadialGradient(cx + r * 0.55, cy, 0, cx + r * 0.55, cy, r * 1.4);
      shadow.addColorStop(0, "rgba(0,0,0,0)");
      shadow.addColorStop(0.55, "rgba(0,0,0,0)");
      shadow.addColorStop(0.8, "rgba(0,0,0,0.35)");
      shadow.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = shadow;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore(); // end sphere clip

      // Rim atmosphere glow
      const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r);
      rim.addColorStop(0, "rgba(0,0,0,0)");
      rim.addColorStop(0.7, "rgba(60,130,255,0.05)");
      rim.addColorStop(0.88, "rgba(80,160,255,0.12)");
      rim.addColorStop(1, "rgba(60,120,220,0.22)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Connection arcs
      CONNECTIONS.forEach(([ai, bi], idx) => {
        const a = CITIES[ai];
        const b = CITIES[bi];
        const pa = project(a.lat, a.lng, rot, cx, cy, r);
        const pb = project(b.lat, b.lng, rot, cx, cy, r);
        if (pa.z < -r * 0.1 || pb.z < -r * 0.1) return;

        const steps = 40;
        const prog = arcProgress.current[idx];
        if (prog <= 0) return;
        const drawSteps = Math.floor(steps * prog);

        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= drawSteps; i++) {
          const t = i / steps;
          const lat = a.lat + (b.lat - a.lat) * t;
          const lng = a.lng + (b.lng - a.lng) * t;
          const lift = Math.sin(Math.PI * t) * 0.15;
          const p = project(lat, lng, rot, cx, cy, r * (1 + lift));
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(254,44,85,0.35)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Traveling dot at tip
        if (prog < 1) {
          const t = prog;
          const lat = a.lat + (b.lat - a.lat) * t;
          const lng = a.lng + (b.lng - a.lng) * t;
          const lift = Math.sin(Math.PI * t) * 0.15;
          const p = project(lat, lng, rot, cx, cy, r * (1 + lift));
          if (p.z > -r * 0.1) {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
            g.addColorStop(0, "rgba(37,244,238,1)");
            g.addColorStop(1, "rgba(37,244,238,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // City dots
      CITIES.forEach((city) => {
        const p = project(city.lat, city.lng, rot, cx, cy, r);
        if (p.z < 0) return;
        const depth = p.z / r;
        const baseAlpha = 0.3 + depth * 0.7;

        if (city.hot) {
          const pulse = (Math.sin(Date.now() * 0.003 + city.lat) + 1) / 2;
          const ringR = 4 + pulse * 8;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, ringR);
          g.addColorStop(0, `rgba(254,44,85,${0.4 * (1 - pulse)})`);
          g.addColorStop(1, "rgba(254,44,85,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
          ctx.fill();

          const dg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
          dg.addColorStop(0, `rgba(254,44,85,${baseAlpha})`);
          dg.addColorStop(1, "rgba(254,44,85,0)");
          ctx.fillStyle = dg;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(37,244,238,${baseAlpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Edge glow
      const edgeGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.5, cx, cy, r);
      edgeGrad.addColorStop(0, "rgba(255,255,255,0)");
      edgeGrad.addColorStop(0.75, "rgba(255,255,255,0)");
      edgeGrad.addColorStop(0.92, "rgba(37,244,238,0.04)");
      edgeGrad.addColorStop(1, "rgba(37,244,238,0.12)");
      ctx.fillStyle = edgeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = () => {
      rotRef.current += 0.0018;
      arcProgress.current = arcProgress.current.map((p, i) => {
        const elapsed = rotRef.current - i * 0.04;
        if (elapsed < 0) return 0;
        return Math.min(1, p + 0.006);
      });
      draw();
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #0b0820 0%, #050510 60%, #020208 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 45%, rgba(20,60,140,0.18) 0%, transparent 65%), " +
            "radial-gradient(ellipse 50% 50% at 20% 70%, rgba(254,44,85,0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 50% at 80% 30%, rgba(60,130,255,0.07) 0%, transparent 60%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.85 }} />
      <div
        className="absolute bottom-0 left-0 right-0 h-72"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #050510 100%)" }}
      />
      <div
        className="absolute inset-y-0 left-0 w-1/4"
        style={{ background: "linear-gradient(to right, #050510 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4"
        style={{ background: "linear-gradient(to left, #050510 0%, transparent 100%)" }}
      />
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <RotatingGlobe />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#25f4ee] animate-pulse" />
            <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">
              150+ Markets · 1 Unified Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-6xl md:text-[96px] font-black text-white leading-[0.93] tracking-tight mb-6"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            One deal.
            <br />
            <span className="text-white">
              Every market.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            TikTok One gives global brands a single point of access to every ad format,
            creative tool, and performance signal — across 150+ markets, simultaneously.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#"
              className="group flex items-center gap-2 bg-[#fe2c55] hover:bg-[#e0203e] text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 hover:shadow-[0_0_50px_rgba(254,44,85,0.45)]"
            >
              Launch a global campaign
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 backdrop-blur-sm"
            >
              <Play size={13} fill="white" />
              Watch overview
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5"
          >
            {STATS.map((s) => (
              <div
                key={s.value}
                className="bg-[#050510]/70 backdrop-blur-sm px-6 py-8 flex flex-col items-center hover:bg-white/5 transition-colors"
              >
                <span className="text-4xl md:text-5xl font-black text-white leading-none" style={{ fontFamily: "Barlow, sans-serif" }}>
                  {s.value}
                </span>
                <span className="mt-2 text-[10px] text-white/35 uppercase tracking-widest text-center">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Markets ticker */}
      <section className="bg-[#050510] border-y border-white/5 py-4 overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex gap-12">
              {[
                "🇺🇸 United States", "🇬🇧 United Kingdom", "🇯🇵 Japan", "🇩🇪 Germany",
                "🇧🇷 Brazil", "🇸🇬 Singapore", "🇦🇺 Australia", "🇫🇷 France",
                "🇰🇷 South Korea", "🇮🇳 India", "🇲🇽 Mexico", "🇦🇪 UAE",
                "🇮🇩 Indonesia", "🇿🇦 South Africa", "🇨🇦 Canada", "🇸🇦 Saudi Arabia",
              ].map((m) => (
                <span key={m} className="text-xs font-medium text-white/30 tracking-wide">{m}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Platform shortcuts */}
      <section className="py-24 px-6 bg-[#050510]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-3">Navigate the platform</p>
          <h2 className="text-4xl font-black text-white mb-12" style={{ fontFamily: "Barlow, sans-serif" }}>
            Where do you want to go?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHORTCUTS.map((s, i) => {
              const Icon = s.Icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <NavLink
                    to={s.to}
                    className="group block bg-[#13131a] border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}22` }}>
                      <Icon size={18} style={{ color: s.color }} />
                    </div>
                    <div className="font-bold text-white text-base mb-1">{s.label}</div>
                    <div className="text-white/40 text-sm mb-4">{s.desc}</div>
                    <div className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2.5 transition-all" style={{ color: s.color }}>
                      Explore <ArrowRight size={11} />
                    </div>
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global reach */}
      <section className="py-24 px-6 bg-[#050510]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-[#25f4ee] uppercase tracking-widest mb-4">Global by design</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily: "Barlow, sans-serif" }}>
              One campaign.
              <br />
              Every timezone.
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-8 max-w-md">
              TikTok One's unified buying infrastructure means your global campaign launches
              simultaneously across all 150+ markets — with local creative optimization built in.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-white border border-white/15 hover:border-white/30 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:bg-white/5">
              Explore global reach <ArrowRight size={13} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { region: "Americas", markets: "22 markets", highlight: "US, Canada, Brazil, Mexico", color: "#fe2c55" },
              { region: "EMEA", markets: "58 markets", highlight: "UK, Germany, France, UAE", color: "#25f4ee" },
              { region: "Asia Pacific", markets: "47 markets", highlight: "Japan, Korea, SEA, ANZ", color: "#7c3aed" },
              { region: "South Asia", markets: "23 markets", highlight: "India, Pakistan, Bangladesh", color: "#ff6b35" },
            ].map((r) => (
              <div key={r.region} className="bg-[#13131a] border border-white/5 rounded-2xl p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: r.color }}>{r.region}</div>
                <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>{r.markets}</div>
                <div className="text-white/35 text-xs">{r.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#050510]">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden px-10 py-16 text-center"
            style={{ background: "linear-gradient(135deg, #0d0015 0%, #1a0010 40%, #0a0a1a 100%)", border: "1px solid rgba(254,44,85,0.15)" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, rgba(254,44,85,0.20) 0%, transparent 55%), " +
                  "radial-gradient(ellipse at 75% 50%, rgba(37,244,238,0.12) 0%, transparent 55%)",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "Barlow, sans-serif" }}>
                Ready to go global?
              </h2>
              <p className="text-white/50 text-base mb-8 max-w-md mx-auto">
                Thousands of brands already use TikTok One as their single command center for worldwide growth.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-[#fe2c55] hover:bg-[#e0203e] text-white font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(254,44,85,0.4)]"
              >
                Create your account <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
