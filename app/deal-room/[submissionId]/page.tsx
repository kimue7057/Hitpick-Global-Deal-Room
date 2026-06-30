import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowUpRight, ChevronLeft, Download, Link2, ShieldCheck } from "lucide-react";

import { MouBlockchainSummary } from "@/components/mou-blockchain-summary";
import { getIssuedMouTokenBySubmissionId, MouRequestError } from "@/lib/mou/server";
import { CERTIFICATE_NOTICE } from "@/lib/mou/types";

export const dynamic = "force-dynamic";

function renderLabelValue(label: string, value: string) {
  return (
    <div key={label}>
      <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="break-words text-sm font-semibold text-white/80">{value || "-"}</p>
    </div>
  );
}

export default async function DealRoomDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  let token;

  try {
    token = await getIssuedMouTokenBySubmissionId(submissionId);
  } catch (error) {
    if (error instanceof MouRequestError) {
      notFound();
    }

    throw error;
  }

  const primaryDetails =
    token.type === "global_deal"
      ? [
          ["Company", token.companyName],
          ["Contact", token.contactName],
          ["Email", token.email],
          ["Country", token.country],
          ["Website", token.website],
          ["Target Market", token.market],
          ["Category", token.category],
          ["Launch Goal", token.goal],
        ]
      : [
          ["Creator", token.creatorName],
          ["Email", token.email],
          ["Country", token.country],
          ["Category", token.category],
          ["Main Channel", token.mainChannel],
          ["SNS Link", token.snsLink],
          ["Goal", token.goal],
          ["Region", token.region],
        ];

  return (
    <div className="min-h-screen bg-[#030812] px-4 pb-20 pt-24 text-white">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition-colors hover:text-white"
          href={token.type === "global_deal" ? "/global-deal" : "/creator"}
        >
          <ChevronLeft size={16} />
          Back to {token.type === "global_deal" ? "Global Deal" : "Creator"}
        </Link>

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="border-b border-white/8 bg-[linear-gradient(135deg,rgba(37,99,235,0.16),rgba(139,92,246,0.12))] px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-300">
                  <ShieldCheck size={14} />
                  Verified Deal Room
                </div>
                <h1
                  className="text-3xl font-black text-white sm:text-4xl"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {token.type === "global_deal"
                    ? token.companyName || "Global Deal Record"
                    : token.creatorName || "Creator Record"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Issued token data, route summary, and blockchain proof are stored on the server and surfaced here for review and follow-up.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  href={`/api/mou/certificate/${token.submissionId}`}
                >
                  <Download size={16} />
                  Download Certificate
                </a>
                {token.blockchain.transactionUrl ? (
                  <a
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/15"
                    href={token.blockchain.transactionUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ArrowUpRight size={16} />
                    View Polygon Proof
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[24px] border border-white/8 bg-[#08101d] p-6">
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Token ID", token.tokenId],
                  ["Submission ID", token.submissionId],
                  ["MOU Type", token.mouType],
                  ["Issued At", new Date(token.issuedAt).toLocaleString()],
                  ["User Email Status", token.emailSent ? "sent" : "pending"],
                  ["Admin Email Status", token.adminEmailSent ? "sent" : "pending"],
                  ...primaryDetails,
                ].map(([label, value]) => renderLabelValue(label, value))}
              </div>

              <div className="mt-6 border-t border-white/8 pt-5">
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                  Document Hash
                </p>
                <p className="break-all font-mono text-xs text-cyan-300/85">{token.documentHash}</p>
              </div>

              <div className="mt-6 border-t border-white/8 pt-5">
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/35">
                  Route Summary
                </p>
                <div className="flex flex-wrap gap-2">
                  {token.route.map((step) => (
                    <span
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70"
                      key={step}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-[24px] border border-white/8 bg-[#08101d] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/75">
                  <Link2 className="text-cyan-300" size={16} />
                  Blockchain Proof
                </div>
                <MouBlockchainSummary
                  blockchain={token.blockchain}
                  tone={token.type === "global_deal" ? "amber" : "violet"}
                />
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[#08101d] p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                  Certificate Notice
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60">{CERTIFICATE_NOTICE}</p>
                {token.signatureUrl ? (
                  <a
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-opacity hover:opacity-80"
                    href={token.signatureUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ArrowUpRight size={15} />
                    View Stored Signature
                  </a>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
