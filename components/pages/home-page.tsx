"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { motion } from "motion/react";
import { ArrowRight, Globe, Play, TrendingUp, Users, Zap } from "lucide-react";

import { makeImageAssets } from "@/lib/make-site-data";

const STATS = [
  { label: "Monthly Active Users", value: "1B+" },
  { label: "Markets Worldwide", value: "150+" },
  { label: "Average ROAS", value: "3.8x" },
  { label: "Lower CPM", value: "40%" },
] as const;

const SHORTCUTS = [
  {
    Icon: Zap,
    color: "#fe2c55",
    desc: "Every format for every goal",
    label: "Ad Solutions",
    to: "/global-deal",
  },
  {
    Icon: TrendingUp,
    color: "#25f4ee",
    desc: "AI, pixel, creative studio",
    label: "Platform Tools",
    to: "/creator",
  },
  {
    Icon: Globe,
    color: "#7c3aed",
    desc: "Data, trends, signals",
    label: "Audience Insights",
    to: "/about",
  },
  {
    Icon: Users,
    color: "#ff6b35",
    desc: "Real results, real brands",
    label: "Case Studies",
    to: "/global-deal",
  },
] as const;

const CONTINENTS: [number, number][][] = [
  [
    [37, -6],
    [36, -2],
    [37, 10],
    [33, 12],
    [31, 25],
    [30, 33],
    [22, 38],
    [15, 42],
    [12, 44],
    [11, 51],
    [2, 42],
    [-1, 41],
    [-4, 40],
    [-10, 40],
    [-17, 37],
    [-26, 33],
    [-34, 26],
    [-35, 19],
    [-29, 17],
    [-23, 14],
    [-18, 12],
    [-10, 13],
    [-5, 10],
    [4, 8],
    [5, 2],
    [4, 9],
    [3, 11],
    [5, 15],
    [14, 15],
    [15, 18],
    [23, 15],
    [25, 10],
    [24, 3],
    [28, -1],
    [30, 5],
    [32, 28],
    [31, 34],
    [37, -6],
  ],
  [
    [36, -9],
    [38, -9],
    [44, -8],
    [44, 0],
    [44, 3],
    [41, 2],
    [38, 0],
    [36, -5],
    [36, 5],
    [37, 10],
    [38, 15],
    [37, 15],
    [38, 13],
    [41, 16],
    [42, 19],
    [42, 22],
    [40, 23],
    [37, 25],
    [36, 28],
    [37, 36],
    [42, 42],
    [42, 45],
    [42, 50],
    [43, 51],
    [44, 50],
    [48, 47],
    [50, 45],
    [54, 42],
    [57, 40],
    [60, 30],
    [65, 30],
    [69, 30],
    [71, 35],
    [71, 50],
    [70, 60],
    [68, 65],
    [66, 70],
    [70, 80],
    [72, 105],
    [72, 140],
    [68, 170],
    [62, 165],
    [55, 140],
    [52, 142],
    [45, 135],
    [42, 130],
    [40, 125],
    [35, 120],
    [25, 120],
    [22, 115],
    [20, 110],
    [10, 105],
    [3, 103],
    [1, 104],
    [5, 100],
    [10, 99],
    [15, 100],
    [20, 100],
    [23, 98],
    [26, 92],
    [23, 90],
    [20, 87],
    [15, 80],
    [8, 78],
    [8, 77],
    [10, 76],
    [12, 79],
    [20, 73],
    [23, 68],
    [24, 63],
    [25, 58],
    [22, 57],
    [22, 50],
    [24, 46],
    [27, 41],
    [30, 32],
    [31, 34],
    [33, 36],
    [36, 36],
    [37, 37],
    [37, 42],
    [38, 44],
    [41, 45],
    [43, 45],
    [43, 50],
    [47, 51],
    [52, 55],
    [54, 60],
    [58, 65],
    [62, 68],
    [65, 68],
    [68, 65],
    [69, 60],
    [70, 65],
    [72, 75],
    [60, 30],
    [55, 38],
    [52, 40],
    [48, 45],
    [45, 40],
    [42, 45],
    [36, 28],
    [36, -9],
  ],
  [
    [71, -157],
    [68, -166],
    [64, -168],
    [60, -147],
    [58, -137],
    [55, -130],
    [49, -125],
    [38, -123],
    [34, -120],
    [23, -110],
    [20, -105],
    [16, -97],
    [15, -93],
    [10, -84],
    [9, -79],
    [9, -77],
    [11, -73],
    [13, -71],
    [26, -80],
    [31, -81],
    [35, -75],
    [40, -72],
    [42, -70],
    [44, -66],
    [47, -53],
    [52, -55],
    [58, -64],
    [62, -64],
    [64, -64],
    [68, -53],
    [72, -60],
    [76, -65],
    [80, -65],
    [83, -55],
    [80, -55],
    [76, -72],
    [74, -80],
    [72, -96],
    [70, -110],
    [71, -130],
    [71, -157],
  ],
  [
    [12, -72],
    [12, -63],
    [11, -62],
    [8, -60],
    [6, -58],
    [4, -53],
    [4, -51],
    [2, -51],
    [0, -50],
    [-5, -35],
    [-8, -35],
    [-10, -37],
    [-15, -39],
    [-23, -43],
    [-30, -50],
    [-35, -57],
    [-38, -62],
    [-55, -65],
    [-55, -68],
    [-52, -70],
    [-45, -66],
    [-40, -62],
    [-35, -57],
    [-23, -70],
    [-18, -70],
    [-5, -81],
    [0, -80],
    [5, -77],
    [8, -77],
    [12, -72],
  ],
  [
    [-14, 130],
    [-14, 136],
    [-12, 136],
    [-12, 142],
    [-15, 145],
    [-18, 147],
    [-24, 152],
    [-30, 153],
    [-34, 151],
    [-38, 147],
    [-38, 140],
    [-35, 137],
    [-32, 134],
    [-33, 115],
    [-26, 113],
    [-22, 114],
    [-18, 122],
    [-16, 123],
    [-14, 127],
    [-14, 130],
  ],
  [
    [76, -65],
    [72, -22],
    [70, -24],
    [65, -37],
    [62, -42],
    [60, -44],
    [64, -52],
    [68, -53],
    [72, -60],
    [76, -65],
  ],
] as const;

const CITIES = [
  { hot: true, lat: 51.5, lng: -0.1 },
  { hot: true, lat: 40.7, lng: -74.0 },
  { hot: true, lat: 35.7, lng: 139.7 },
  { hot: true, lat: 37.6, lng: 126.9 },
  { hot: true, lat: 1.35, lng: 103.8 },
  { hot: false, lat: -33.9, lng: 151.2 },
  { hot: false, lat: 48.9, lng: 2.3 },
  { hot: false, lat: 52.5, lng: 13.4 },
  { hot: true, lat: 25.2, lng: 55.3 },
  { hot: false, lat: 19.1, lng: 72.9 },
  { hot: true, lat: -23.5, lng: -46.6 },
  { hot: false, lat: 34.1, lng: -118.2 },
  { hot: false, lat: 43.7, lng: -79.4 },
  { hot: false, lat: 6.5, lng: 3.4 },
  { hot: false, lat: -26.2, lng: 28.0 },
  { hot: false, lat: 55.8, lng: 37.6 },
  { hot: false, lat: 39.9, lng: 116.4 },
  { hot: false, lat: -6.2, lng: 106.8 },
  { hot: false, lat: 24.7, lng: 46.7 },
  { hot: false, lat: 19.4, lng: -99.1 },
] as const;

const CONNECTIONS = [
  [0, 1],
  [0, 6],
  [0, 8],
  [1, 10],
  [1, 11],
  [2, 3],
  [2, 4],
  [3, 4],
  [4, 7],
  [5, 4],
  [8, 9],
  [8, 2],
  [0, 15],
  [10, 13],
] as const;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

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
    const targetCanvas = canvas;

    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;
    const targetCtx = ctx;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      targetCanvas.width = targetCanvas.offsetWidth * dpr;
      targetCanvas.height = targetCanvas.offsetHeight * dpr;
      targetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const width = targetCanvas.offsetWidth;
      const height = targetCanvas.offsetHeight;
      targetCtx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;
      if (radius < 10) return;
      const rot = rotRef.current;

      const halo = targetCtx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.18);
      halo.addColorStop(0, "rgba(80,160,255,0.08)");
      halo.addColorStop(0.5, "rgba(60,120,220,0.04)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      targetCtx.fillStyle = halo;
      targetCtx.beginPath();
      targetCtx.arc(cx, cy, radius * 1.18, 0, Math.PI * 2);
      targetCtx.fill();

      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      targetCtx.clip();

      const ocean = targetCtx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.25,
        radius * 0.1,
        cx,
        cy,
        radius,
      );
      ocean.addColorStop(0, "#0d2240");
      ocean.addColorStop(0.6, "#071428");
      ocean.addColorStop(1, "#030a14");
      targetCtx.fillStyle = ocean;
      targetCtx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      for (let lat = -75; lat <= 75; lat += 30) {
        const phi = toRad(90 - lat);
        const ringRadius = radius * Math.sin(phi);
        const ringY = cy - radius * Math.cos(phi);
        targetCtx.beginPath();
        for (let i = 0; i <= 120; i += 1) {
          const theta = (i / 120) * Math.PI * 2 + rot;
          const x = cx + ringRadius * Math.cos(theta);
          if (i === 0) targetCtx.moveTo(x, ringY);
          else targetCtx.lineTo(x, ringY);
        }
        targetCtx.strokeStyle = "rgba(100,160,220,0.07)";
        targetCtx.lineWidth = 0.5;
        targetCtx.stroke();
      }

      for (let lng = 0; lng < 360; lng += 30) {
        const theta = toRad(lng) + rot;
        targetCtx.beginPath();
        for (let i = 0; i <= 60; i += 1) {
          const phi = (i / 60) * Math.PI;
          const x = cx + radius * Math.sin(phi) * Math.cos(theta);
          const y = cy - radius * Math.cos(phi);
          if (i === 0) targetCtx.moveTo(x, y);
          else targetCtx.lineTo(x, y);
        }
        targetCtx.strokeStyle = "rgba(100,160,220,0.07)";
        targetCtx.lineWidth = 0.5;
        targetCtx.stroke();
      }

      CONTINENTS.forEach((coords) => {
        targetCtx.beginPath();
        let penDown = false;
        coords.forEach(([lat, lng]) => {
          const point = project(lat, lng, rot, cx, cy, radius);
          if (point.z < 0) {
            penDown = false;
            return;
          }
          if (!penDown) {
            targetCtx.moveTo(point.x, point.y);
            penDown = true;
          } else {
            targetCtx.lineTo(point.x, point.y);
          }
        });
        targetCtx.closePath();

        const land = targetCtx.createRadialGradient(
          cx - radius * 0.15,
          cy - radius * 0.15,
          0,
          cx,
          cy,
          radius,
        );
        land.addColorStop(0, "rgba(72,105,72,0.95)");
        land.addColorStop(0.7, "rgba(50,78,52,0.90)");
        land.addColorStop(1, "rgba(30,50,32,0.85)");
        targetCtx.fillStyle = land;
        targetCtx.fill();
        targetCtx.strokeStyle = "rgba(100,150,105,0.35)";
        targetCtx.lineWidth = 0.6;
        targetCtx.stroke();
      });

      const shadow = targetCtx.createRadialGradient(
        cx + radius * 0.55,
        cy,
        0,
        cx + radius * 0.55,
        cy,
        radius * 1.4,
      );
      shadow.addColorStop(0, "rgba(0,0,0,0)");
      shadow.addColorStop(0.55, "rgba(0,0,0,0)");
      shadow.addColorStop(0.8, "rgba(0,0,0,0.35)");
      shadow.addColorStop(1, "rgba(0,0,0,0.75)");
      targetCtx.fillStyle = shadow;
      targetCtx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      targetCtx.restore();

      const rim = targetCtx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius);
      rim.addColorStop(0, "rgba(0,0,0,0)");
      rim.addColorStop(0.7, "rgba(60,130,255,0.05)");
      rim.addColorStop(0.88, "rgba(80,160,255,0.12)");
      rim.addColorStop(1, "rgba(60,120,220,0.22)");
      targetCtx.fillStyle = rim;
      targetCtx.beginPath();
      targetCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      targetCtx.fill();

      CONNECTIONS.forEach(([aIndex, bIndex], idx) => {
        const a = CITIES[aIndex];
        const b = CITIES[bIndex];
        const pointA = project(a.lat, a.lng, rot, cx, cy, radius);
        const pointB = project(b.lat, b.lng, rot, cx, cy, radius);
        if (pointA.z < -radius * 0.1 || pointB.z < -radius * 0.1) return;

        const steps = 40;
        const progress = arcProgress.current[idx];
        if (progress <= 0) return;
        const drawSteps = Math.floor(steps * progress);

        targetCtx.beginPath();
        let started = false;
        for (let i = 0; i <= drawSteps; i += 1) {
          const t = i / steps;
          const lat = a.lat + (b.lat - a.lat) * t;
          const lng = a.lng + (b.lng - a.lng) * t;
          const lift = Math.sin(Math.PI * t) * 0.15;
          const point = project(lat, lng, rot, cx, cy, radius * (1 + lift));
          if (!started) {
            targetCtx.moveTo(point.x, point.y);
            started = true;
          } else {
            targetCtx.lineTo(point.x, point.y);
          }
        }
        targetCtx.strokeStyle = "rgba(254,44,85,0.35)";
        targetCtx.lineWidth = 0.8;
        targetCtx.setLineDash([4, 5]);
        targetCtx.stroke();
        targetCtx.setLineDash([]);

        if (progress < 1) {
          const t = progress;
          const lat = a.lat + (b.lat - a.lat) * t;
          const lng = a.lng + (b.lng - a.lng) * t;
          const lift = Math.sin(Math.PI * t) * 0.15;
          const point = project(lat, lng, rot, cx, cy, radius * (1 + lift));
          if (point.z > -radius * 0.1) {
            const glow = targetCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 6);
            glow.addColorStop(0, "rgba(37,244,238,1)");
            glow.addColorStop(1, "rgba(37,244,238,0)");
            targetCtx.fillStyle = glow;
            targetCtx.beginPath();
            targetCtx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            targetCtx.fill();
          }
        }
      });

      CITIES.forEach((city) => {
        const point = project(city.lat, city.lng, rot, cx, cy, radius);
        if (point.z < 0) return;
        const depth = point.z / radius;
        const baseAlpha = 0.3 + depth * 0.7;

        if (city.hot) {
          const pulse = (Math.sin(Date.now() * 0.003 + city.lat) + 1) / 2;
          const ringRadius = 4 + pulse * 8;
          const ring = targetCtx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            ringRadius,
          );
          ring.addColorStop(0, `rgba(254,44,85,${0.4 * (1 - pulse)})`);
          ring.addColorStop(1, "rgba(254,44,85,0)");
          targetCtx.fillStyle = ring;
          targetCtx.beginPath();
          targetCtx.arc(point.x, point.y, ringRadius, 0, Math.PI * 2);
          targetCtx.fill();

          const dotGlow = targetCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 4);
          dotGlow.addColorStop(0, `rgba(254,44,85,${baseAlpha})`);
          dotGlow.addColorStop(1, "rgba(254,44,85,0)");
          targetCtx.fillStyle = dotGlow;
          targetCtx.beginPath();
          targetCtx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          targetCtx.fill();

          targetCtx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
          targetCtx.beginPath();
          targetCtx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          targetCtx.fill();
        } else {
          targetCtx.fillStyle = `rgba(37,244,238,${baseAlpha * 0.6})`;
          targetCtx.beginPath();
          targetCtx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
          targetCtx.fill();
        }
      });

      const edge = targetCtx.createRadialGradient(
        cx - radius * 0.2,
        cy - radius * 0.2,
        radius * 0.5,
        cx,
        cy,
        radius,
      );
      edge.addColorStop(0, "rgba(255,255,255,0)");
      edge.addColorStop(0.75, "rgba(255,255,255,0)");
      edge.addColorStop(0.92, "rgba(37,244,238,0.04)");
      edge.addColorStop(1, "rgba(37,244,238,0.12)");
      targetCtx.fillStyle = edge;
      targetCtx.beginPath();
      targetCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      targetCtx.fill();
    };

    const tick = () => {
      rotRef.current += 0.0018;
      arcProgress.current = arcProgress.current.map((progress, index) => {
        const elapsed = rotRef.current - index * 0.04;
        if (elapsed < 0) return 0;
        return Math.min(1, progress + 0.006);
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
        style={{
          background: "radial-gradient(ellipse at 50% 40%, #0b0820 0%, #050510 60%, #020208 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 45%, rgba(20,60,140,0.18) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 20% 70%, rgba(254,44,85,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(60,130,255,0.07) 0%, transparent 60%)",
        }}
      />
      <img
        alt="Hitpick wordmark watermark"
        className="pointer-events-none absolute left-1/2 top-[16%] hidden w-[360px] -translate-x-1/2 opacity-[0.08] mix-blend-screen lg:block"
        src={makeImageAssets.logoWordmark}
      />
      <img
        alt="Hitpick banner watermark"
        className="pointer-events-none absolute bottom-[9%] right-[6%] hidden w-[240px] rounded-2xl border border-white/8 bg-black/20 p-3 opacity-[0.15] xl:block"
        src={makeImageAssets.heroBanner}
      />
      <img
        alt="Hitpick logo mark watermark"
        className="pointer-events-none absolute left-[8%] top-[26%] hidden w-24 opacity-[0.16] xl:block"
        src={makeImageAssets.logoMark}
      />
      <canvas className="absolute inset-0 h-full w-full" ref={canvasRef} style={{ opacity: 0.85 }} />
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
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16">
        <RotatingGlobe />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#25f4ee]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
              150+ Markets / 1 Unified Platform
            </span>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-6xl font-black leading-[0.93] tracking-tight text-white md:text-[96px]"
            initial={{ opacity: 0, y: 30 }}
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            transition={{ delay: 0.1, duration: 0.65 }}
          >
            One deal.
            <br />
            <span className="text-white">Every market.</span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/45 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.22, duration: 0.6 }}
          >
            TikTok One gives global brands a single point of access to every ad format, creative tool, and performance signal across 150+ markets, simultaneously.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.32, duration: 0.6 }}
          >
            <Link
              className="group flex items-center gap-2 rounded-full bg-[#fe2c55] px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-[#e0203e] hover:shadow-[0_0_50px_rgba(254,44,85,0.45)]"
              href="/global-deal"
            >
              Launch a global campaign
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
            </Link>
            <Link
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
              href="/about"
            >
              <Play fill="white" size={13} />
              Watch overview
            </Link>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {STATS.map((stat) => (
              <div
                className="flex flex-col items-center bg-[#050510]/70 px-6 py-8 backdrop-blur-sm transition-colors hover:bg-white/5"
                key={stat.value}
              >
                <span
                  className="text-4xl font-black leading-none text-white md:text-5xl"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {stat.value}
                </span>
                <span className="mt-2 text-center text-[10px] uppercase tracking-widest text-white/35">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-white/5 bg-[#050510] py-4">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          className="flex gap-12 whitespace-nowrap"
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {[...Array(2)].map((_, rep) => (
            <div className="flex gap-12" key={rep}>
              {[
                "United States",
                "United Kingdom",
                "Japan",
                "Germany",
                "Brazil",
                "Singapore",
                "Australia",
                "France",
                "South Korea",
                "India",
                "Mexico",
                "UAE",
                "Indonesia",
                "South Africa",
                "Canada",
                "Saudi Arabia",
              ].map((market) => (
                <span className="text-xs font-medium tracking-wide text-white/30" key={market}>
                  {market}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      <section className="bg-[#050510] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/35">
            Navigate the platform
          </p>
          <h2
            className="mb-12 text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Where do you want to go?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SHORTCUTS.map((shortcut, index) => {
              const Icon = shortcut.Icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  key={shortcut.label}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Link
                    className="group block rounded-2xl border border-white/5 bg-[#13131a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
                    href={shortcut.to}
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${shortcut.color}22` }}
                    >
                      <Icon size={18} style={{ color: shortcut.color }} />
                    </div>
                    <div className="mb-1 text-base font-bold text-white">{shortcut.label}</div>
                    <div className="mb-4 text-sm text-white/40">{shortcut.desc}</div>
                    <div
                      className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2.5"
                      style={{ color: shortcut.color }}
                    >
                      Explore <ArrowRight size={11} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#050510] px-6 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#25f4ee]">
              Global by design
            </p>
            <h2
              className="mb-6 text-4xl font-black leading-tight text-white md:text-5xl"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
              One campaign.
              <br />
              Every timezone.
            </h2>
            <p className="mb-8 max-w-md text-base leading-relaxed text-white/45">
              TikTok One&apos;s unified buying infrastructure means your global campaign launches simultaneously across all 150+ markets with local creative optimization built in.
            </p>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/5"
              href="/global-deal"
            >
              Explore global reach <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                color: "#fe2c55",
                highlight: "US, Canada, Brazil, Mexico",
                markets: "22 markets",
                region: "Americas",
              },
              {
                color: "#25f4ee",
                highlight: "UK, Germany, France, UAE",
                markets: "58 markets",
                region: "EMEA",
              },
              {
                color: "#7c3aed",
                highlight: "Japan, Korea, SEA, ANZ",
                markets: "47 markets",
                region: "Asia Pacific",
              },
              {
                color: "#ff6b35",
                highlight: "India, Pakistan, Bangladesh",
                markets: "23 markets",
                region: "South Asia",
              },
            ].map((region) => (
              <div className="rounded-2xl border border-white/5 bg-[#13131a] p-5" key={region.region}>
                <div
                  className="mb-2 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: region.color }}
                >
                  {region.region}
                </div>
                <div
                  className="mb-1 text-2xl font-black text-white"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {region.markets}
                </div>
                <div className="text-xs text-white/35">{region.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050510] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div
            className="relative overflow-hidden rounded-3xl px-10 py-16 text-center"
            style={{
              background: "linear-gradient(135deg, #0d0015 0%, #1a0010 40%, #0a0a1a 100%)",
              border: "1px solid rgba(254,44,85,0.15)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, rgba(254,44,85,0.20) 0%, transparent 55%), radial-gradient(ellipse at 75% 50%, rgba(37,244,238,0.12) 0%, transparent 55%)",
              }}
            />
            <img
              alt="Hitpick banner background"
              className="pointer-events-none absolute bottom-0 right-0 w-[300px] opacity-[0.1]"
              src={makeImageAssets.heroBanner}
            />
            <div className="relative z-10">
              <h2
                className="mb-4 text-5xl font-black text-white md:text-6xl"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Ready to go global?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-base text-white/50">
                Thousands of brands already use TikTok One as their single command center for worldwide growth.
              </p>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-[#fe2c55] px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 hover:bg-[#e0203e] hover:shadow-[0_0_40px_rgba(254,44,85,0.4)]"
                href="/global-deal"
              >
                Create your account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
