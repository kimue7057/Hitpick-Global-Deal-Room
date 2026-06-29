import type { CSSProperties } from "react";

import type { VisualCardAsset } from "@/lib/make-site-data";

export function MakeAssetImage({
  asset,
  className,
}: {
  asset: VisualCardAsset;
  className?: string;
}) {
  const fit = asset.fit ?? "cover";

  return (
    <div className={["absolute inset-0", asset.backgroundClassName ?? "", className ?? ""].join(" ")}>
      <img
        alt={asset.alt}
        className={[
          "absolute inset-0 h-full w-full",
          fit === "contain" ? "object-contain" : "object-cover",
          asset.imageClassName ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        src={asset.src}
        style={asset.objectPosition ? ({ objectPosition: asset.objectPosition } as CSSProperties) : undefined}
      />
    </div>
  );
}
