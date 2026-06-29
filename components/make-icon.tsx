import type { CSSProperties, ComponentType } from "react";

import {
  Award,
  BarChart3,
  Building2,
  Cpu,
  FileText,
  Globe2,
  Layers,
  Lock,
  Network,
  Shield,
  ShoppingBag,
  Store,
  Users,
  Zap,
} from "lucide-react";

import type { SimpleCard } from "@/lib/make-site-data";

const iconMap = {
  award: Award,
  "bar-chart-3": BarChart3,
  "building-2": Building2,
  cpu: Cpu,
  "file-text": FileText,
  "globe-2": Globe2,
  layers: Layers,
  lock: Lock,
  network: Network,
  shield: Shield,
  "shopping-bag": ShoppingBag,
  store: Store,
  users: Users,
  zap: Zap,
} as const satisfies Record<
  SimpleCard["icon"],
  ComponentType<{ size?: number; className?: string; style?: CSSProperties }>
>;

export function MakeIcon({
  color,
  icon,
  size = 18,
}: {
  color?: string;
  icon: SimpleCard["icon"];
  size?: number;
}) {
  const Icon = iconMap[icon];

  return <Icon size={size} style={color ? { color } : undefined} />;
}
