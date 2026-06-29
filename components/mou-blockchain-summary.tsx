import { AlertTriangle, CheckCircle2, ExternalLink, Link2, Shield } from "lucide-react";

import type { MouBlockchainReceipt } from "@/lib/mou/types";

type MouBlockchainSummaryProps = {
  blockchain: MouBlockchainReceipt;
  tone: "amber" | "violet";
};

const TONE_STYLES = {
  amber: {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    accent: "text-amber-300",
  },
  violet: {
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    accent: "text-violet-200",
  },
} as const;

function trimHash(value: string | null) {
  if (!value) {
    return "-";
  }

  return value.length > 18 ? `${value.slice(0, 10)}...${value.slice(-6)}` : value;
}

export function MouBlockchainSummary({ blockchain, tone }: MouBlockchainSummaryProps) {
  const toneStyle = TONE_STYLES[tone];
  const isAnchored = blockchain.status === "anchored";
  const isFailed = blockchain.status === "failed";

  return (
    <div className="mt-4 border-t border-white/5 pt-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isAnchored ? (
            <CheckCircle2 className="text-green-400" size={14} />
          ) : isFailed ? (
            <AlertTriangle className="text-rose-300" size={14} />
          ) : (
            <Shield className="text-white/45" size={14} />
          )}
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Blockchain</p>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${toneStyle.badge}`}
        >
          {blockchain.status === "anchored"
            ? "Anchored"
            : blockchain.status === "failed"
              ? "Anchor Failed"
              : "Not Configured"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="mb-0.5 text-white/30">Network</p>
          <p className={toneStyle.accent}>{blockchain.networkName || "-"}</p>
        </div>
        <div>
          <p className="mb-0.5 text-white/30">Chain ID</p>
          <p className="text-white/70">{blockchain.chainId ?? "-"}</p>
        </div>
        <div>
          <p className="mb-0.5 text-white/30">Registry</p>
          <p className="font-mono text-[11px] text-white/70">{trimHash(blockchain.registryAddress)}</p>
        </div>
        <div>
          <p className="mb-0.5 text-white/30">Proof Key</p>
          <p className="font-mono text-[11px] text-cyan-300/80">{trimHash(blockchain.proofKey)}</p>
        </div>
        <div>
          <p className="mb-0.5 text-white/30">Transaction</p>
          <p className="font-mono text-[11px] text-white/70">{trimHash(blockchain.transactionHash)}</p>
        </div>
        <div>
          <p className="mb-0.5 text-white/30">Block</p>
          <p className="text-white/70">{blockchain.blockNumber ?? "-"}</p>
        </div>
      </div>

      {blockchain.transactionUrl ? (
        <a
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 transition-opacity hover:opacity-80"
          href={blockchain.transactionUrl}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink size={12} />
          View On-Chain Transaction
        </a>
      ) : null}

      {!isAnchored ? (
        <p className="mt-3 text-[11px] leading-relaxed text-white/40">
          {blockchain.error
            ? blockchain.error
            : "Blockchain anchoring will start once RPC, wallet, and registry address are configured."}
        </p>
      ) : (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-green-300/85">
          <Link2 size={12} />
          Anchored at{" "}
          {blockchain.anchoredAt ? new Date(blockchain.anchoredAt).toLocaleString() : "-"}
        </div>
      )}
    </div>
  );
}
