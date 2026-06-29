import { footerColumns, makeImageAssets } from "@/lib/make-site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#060609] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <img
                alt="Hit Deal Room"
                className="h-9 w-auto"
                src={makeImageAssets.logoWordmark}
                style={{ mixBlendMode: "screen" }}
              />
            </div>
            <p className="text-xs leading-relaxed text-white/30">
              Korean creator network connecting brands with global audiences, commerce routes, and verified partnerships.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">
                {column.title}
              </div>
              <ul className="space-y-3">
                {column.items.map((item) => (
                  <li className="text-sm text-white/30" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-white/20">Copyright 2025 Hitpick. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
              <span className="text-xs text-white/20" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
