import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import logoImg from "../imports/Gemini_Generated_Image_meg9i1meg9i1meg9.png";

const NAV_LINKS = [
  { label: "Global Deal", to: "/global-deal" },
  { label: "Creator", to: "/creator" },
  { label: "About", to: "/about" },
];

// Map each route to a product badge label
const ROUTE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "/global-deal": { label: "Deal",    color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  "/creator":     { label: "Creator", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  "/about":       { label: "About",   color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
};

function HitpickLogo({ pathname: _ }: { pathname: string }) {
  return (
    <NavLink to="/" className="flex items-center shrink-0">
      <img
        src={logoImg}
        alt="Hit Deal Room"
        className="h-11 w-auto"
        style={{ mixBlendMode: "screen" }}
      />
    </NavLink>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <HitpickLogo pathname={location.pathname} />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/[0.08] font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm font-bold text-white bg-[#7700ff] hover:bg-[#6600ee] transition-colors px-5 py-2.5 rounded-full"
          >
            Get started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 px-6 pb-6"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `block py-3 text-sm border-b border-white/5 ${
                    isActive ? "text-white font-semibold" : "text-white/60"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="#"
              className="mt-4 block text-center text-sm font-bold text-white bg-[#7700ff] px-5 py-3 rounded-full"
            >
              Get started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const cols = {
    Platform:  ["Global Deal", "Creator Network", "Brand Campaigns", "Commerce", "Measurement"],
    Solutions: ["Brand Awareness", "Performance", "Creator Collab", "Lead Generation", "Partnership MOU"],
    Resources: ["Help Center", "Blog", "Case Studies", "Events", "Partner Directory"],
    Company:   ["About Hitpick", "Newsroom", "Careers", "Sustainability", "Trust & Safety"],
  };
  return (
    <footer className="bg-[#060609] border-t border-white/5 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <img src={logoImg} alt="Hit Deal Room" className="h-9 w-auto" style={{ mixBlendMode: "screen" }} />
            </div>
            <p className="text-white/30 text-xs leading-relaxed">
              Korean creator network connecting brands with global audiences, commerce routes, and verified partnerships.
            </p>
          </div>
          {Object.entries(cols).map(([cat, items]) => (
            <div key={cat}>
              <div className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">{cat}</div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/30 text-sm hover:text-white/60 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs">© 2025 Hitpick Inc. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
              <a key={item} href="#" className="text-white/20 text-xs hover:text-white/50 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Root() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
