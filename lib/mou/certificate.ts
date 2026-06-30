import type { IssuedMouToken } from "@/lib/mou/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatValue(value: string | null | undefined) {
  return value && value.trim() ? escapeHtml(value.trim()) : "-";
}

function formatIssuedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildDetailRows(token: IssuedMouToken) {
  if (token.type === "global_deal") {
    return [
      ["Company", token.companyName],
      ["Contact", token.contactName],
      ["Email", token.email],
      ["Country", token.country],
      ["Website", token.website],
      ["Target Market", token.market],
      ["Category", token.category],
      ["Launch Goal", token.goal],
    ] satisfies Array<[string, string]>;
  }

  return [
    ["Creator", token.creatorName],
    ["Email", token.email],
    ["Country", token.country],
    ["Category", token.category],
    ["Main Channel", token.mainChannel],
    ["SNS Link", token.snsLink],
    ["Goal", token.goal],
    ["Region", token.region],
  ] satisfies Array<[string, string]>;
}

export function buildMouCertificateFilename(token: IssuedMouToken) {
  const prefix = token.type === "global_deal" ? "global-deal" : "creator-passport";
  return `hitpick-${prefix}-${token.tokenId}.html`;
}

export function buildMouCertificateHtml(token: IssuedMouToken) {
  const details = buildDetailRows(token)
    .map(
      ([label, value]) =>
        `<tr><th>${escapeHtml(label)}</th><td>${formatValue(value)}</td></tr>`,
    )
    .join("");
  const routeItems = token.route
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");
  const blockchainDetailRows: Array<[string, string | null]> = [
    ["Status", token.blockchain.status],
    ["Network", token.blockchain.networkName],
    ["Chain ID", token.blockchain.chainId?.toString() ?? null],
    ["Registry", token.blockchain.registryAddress],
    ["Proof Key", token.blockchain.proofKey],
    ["Transaction Hash", token.blockchain.transactionHash],
    ["Block Number", token.blockchain.blockNumber?.toString() ?? null],
    [
      "Anchored At",
      token.blockchain.anchoredAt ? formatIssuedAt(token.blockchain.anchoredAt) : null,
    ],
  ];
  const blockchainRows = blockchainDetailRows
    .map(
      ([label, value]) =>
        `<tr><th>${escapeHtml(label)}</th><td>${formatValue(value)}</td></tr>`,
    )
    .join("");
  const title =
    token.type === "global_deal"
      ? "Hitpick Global Deal Membership Certificate"
      : "Hitpick Creator Passport Membership Certificate";
  const transactionLink = token.blockchain.transactionUrl
    ? `<p class="link-row"><a href="${escapeHtml(token.blockchain.transactionUrl)}" target="_blank" rel="noreferrer">View On-Chain Transaction</a></p>`
    : "";
  const signatureLink = token.signatureUrl
    ? `<p class="link-row"><a href="${escapeHtml(token.signatureUrl)}" target="_blank" rel="noreferrer">View Stored Signature</a></p>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} - ${escapeHtml(token.tokenId)}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #06101d;
        --panel: #0d1727;
        --line: rgba(148, 163, 184, 0.18);
        --muted: #8da0bb;
        --text: #f8fafc;
        --accent: #60a5fa;
        --accent-2: #8b5cf6;
        --success: #4ade80;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background:
          radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 30%),
          radial-gradient(circle at top right, rgba(139, 92, 246, 0.16), transparent 28%),
          var(--bg);
        color: var(--text);
        font-family: Inter, Arial, sans-serif;
        padding: 40px 20px;
      }
      .sheet {
        max-width: 980px;
        margin: 0 auto;
        border: 1px solid var(--line);
        border-radius: 28px;
        background: rgba(13, 23, 39, 0.92);
        overflow: hidden;
        box-shadow: 0 20px 70px rgba(0, 0, 0, 0.35);
      }
      .hero {
        padding: 36px 40px 28px;
        border-bottom: 1px solid var(--line);
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(17, 24, 39, 0.84));
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--success);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      h1 {
        margin: 16px 0 10px;
        font-size: 34px;
        line-height: 1.05;
      }
      .sub {
        color: var(--muted);
        margin: 0;
        max-width: 720px;
        line-height: 1.6;
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 14px;
        margin-top: 26px;
      }
      .meta-card,
      .panel {
        border: 1px solid var(--line);
        border-radius: 20px;
        background: rgba(15, 23, 42, 0.54);
      }
      .meta-card {
        padding: 16px 18px;
      }
      .meta-card span,
      .panel h2 {
        display: block;
        font-size: 12px;
        color: var(--muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .meta-card strong {
        display: block;
        margin-top: 8px;
        font-size: 15px;
        word-break: break-word;
      }
      .content {
        display: grid;
        gap: 20px;
        padding: 28px 40px 40px;
      }
      .panel {
        padding: 24px;
      }
      .panel h2 {
        margin: 0 0 16px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        text-align: left;
        padding: 12px 0;
        border-bottom: 1px solid var(--line);
        vertical-align: top;
      }
      th {
        width: 220px;
        color: var(--muted);
        font-weight: 600;
      }
      td {
        word-break: break-word;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      li {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 9px 14px;
        background: rgba(255, 255, 255, 0.03);
        font-size: 13px;
      }
      .hash {
        font-family: "SFMono-Regular", Consolas, monospace;
        font-size: 13px;
        color: #7dd3fc;
      }
      .footer {
        padding: 0 40px 40px;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.6;
      }
      .link-row {
        margin: 14px 0 0;
      }
      a {
        color: var(--accent);
      }
      @media (max-width: 720px) {
        .hero,
        .content,
        .footer {
          padding-left: 20px;
          padding-right: 20px;
        }
        h1 {
          font-size: 28px;
        }
        th {
          width: 140px;
        }
      }
    </style>
  </head>
  <body>
    <div class="sheet">
      <section class="hero">
        <div class="eyebrow">Verified Certificate</div>
        <h1>${escapeHtml(title)}</h1>
        <p class="sub">
          This file is generated from the Hitpick issuance record and includes the stored certificate data, route summary, and blockchain proof reference.
        </p>
        <div class="meta">
          <div class="meta-card">
            <span>Token ID</span>
            <strong>${escapeHtml(token.tokenId)}</strong>
          </div>
          <div class="meta-card">
            <span>Submission ID</span>
            <strong>${escapeHtml(token.submissionId)}</strong>
          </div>
          <div class="meta-card">
            <span>Issued At</span>
            <strong>${escapeHtml(formatIssuedAt(token.issuedAt))}</strong>
          </div>
          <div class="meta-card">
            <span>Status</span>
            <strong>${escapeHtml(token.status)}</strong>
          </div>
        </div>
      </section>

      <div class="content">
        <section class="panel">
          <h2>Certificate Details</h2>
          <table>
            <tbody>
              <tr><th>Membership Type</th><td>${escapeHtml(token.mouType)}</td></tr>
              <tr><th>Proof Type</th><td>${escapeHtml(token.proofType)}</td></tr>
              ${details}
            </tbody>
          </table>
        </section>

        <section class="panel">
          <h2>Route Summary</h2>
          <ul>${routeItems}</ul>
        </section>

        <section class="panel">
          <h2>Proof Integrity</h2>
          <table>
            <tbody>
              <tr><th>Document Hash</th><td class="hash">${escapeHtml(token.documentHash)}</td></tr>
              ${blockchainRows}
            </tbody>
          </table>
          ${transactionLink}
          ${signatureLink}
        </section>
      </div>

      <div class="footer">
        <p>${escapeHtml(token.notice)}</p>
        <p>User email delivery: ${token.emailSent ? "sent" : "pending"} | Admin email delivery: ${token.adminEmailSent ? "sent" : "pending"}</p>
      </div>
    </div>
  </body>
</html>`;
}
