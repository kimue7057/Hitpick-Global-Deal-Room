import "server-only";

import { createHash, randomInt } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import { anchorMouProofOnChain } from "@/lib/blockchain/server";
import {
  CERTIFICATE_NOTICE,
  type MouBlockchainReceipt,
  type CreatorFormData,
  type CreatorIssuePayload,
  type CreatorIssuedToken,
  type CreatorSelections,
  type GlobalDealFormData,
  type GlobalDealIssuePayload,
  type GlobalDealIssuedToken,
  type GlobalDealSelections,
  type IssuedMouToken,
  type MouIssuePayload,
  type MouSubmissionType,
  type ProofType,
} from "@/lib/mou/types";

type JsonObject = Record<string, unknown>;

type DbSubmissionRow = {
  admin_email_sent: boolean | null;
  anchored_at: string | null;
  anchor_error: string | null;
  block_number: number | null;
  blockchain_status: "anchored" | "failed" | "not_configured";
  category: string | null;
  chain_id: number | null;
  company_name: string | null;
  contact_name: string | null;
  country: string | null;
  created_at: string;
  creator_name: string | null;
  document_hash: string;
  email: string;
  email_sent: boolean | null;
  goal: string | null;
  id: string;
  issued_at: string;
  main_channel: string | null;
  market: string | null;
  mou_type: string;
  network_name: string | null;
  name: string | null;
  proof_type: ProofType;
  proof_key: string | null;
  raw_payload: unknown;
  registry_address: string | null;
  region: string | null;
  route: unknown;
  route_hash: string | null;
  signature_hash: string | null;
  signature_url: string | null;
  sns_link: string | null;
  status: string;
  subject_hash: string | null;
  token_id: string;
  transaction_hash: string | null;
  transaction_url: string | null;
  type: MouSubmissionType;
  updated_at: string;
  website: string | null;
};

type SubmissionRecord = {
  adminEmailSent: boolean;
  blockchain: MouBlockchainReceipt;
  category: string;
  companyName: string;
  contactName: string;
  country: string;
  creatorName: string;
  documentHash: string;
  email: string;
  emailSent: boolean;
  goal: string;
  id: string;
  issuedAt: string;
  mainChannel: string;
  market: string;
  mouType: string;
  name: string;
  proofType: ProofType;
  rawPayload: JsonObject;
  region: string;
  route: string[];
  signatureHash: string;
  signatureUrl: string | null;
  snsLink: string;
  status: string;
  tokenId: string;
  type: MouSubmissionType;
  website: string;
};

type IssueResult = {
  token: IssuedMouToken;
  warning?: string;
};

type ResendResult = {
  adminEmailSent: boolean;
  emailSent: boolean;
};

type EmailMessage = {
  html: string;
  subject: string;
  text: string;
};

type EmailDeliveryStatus = {
  adminEmailSent: boolean;
  emailSent: boolean;
};

type EmailServices = {
  adminEmail: string;
  emailFrom: string;
  resend: Resend;
};

type ResolvedServices = {
  bucket: string;
  email: EmailServices | null;
  supabase: ReturnType<typeof createSupabaseClient>;
};

const GLOBAL_MOU_TYPE = "Global Partnership Membership";
const CREATOR_MOU_TYPE = "Creator Network Membership";

export class MouRequestError extends Error {}

function createSupabaseClient(url: string, serviceRoleKey: string) {
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function createDefaultBlockchainReceipt(): MouBlockchainReceipt {
  return {
    anchoredAt: null,
    blockNumber: null,
    chainId: null,
    error: null,
    networkName: null,
    proofKey: null,
    registryAddress: null,
    routeHash: null,
    status: "not_configured",
    subjectHash: null,
    transactionHash: null,
    transactionUrl: null,
  };
}

function getServices(): ResolvedServices {
  const url = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey =
    getOptionalEnv("SUPABASE_SECRET_KEY") ?? getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = getOptionalEnv("RESEND_API_KEY");
  const emailFrom = getOptionalEnv("EMAIL_FROM");
  const adminEmail = getOptionalEnv("ADMIN_EMAIL");
  const email =
    resendApiKey && emailFrom && adminEmail
      ? {
          adminEmail,
          emailFrom,
          resend: new Resend(resendApiKey),
        }
      : null;

  return {
    bucket: getRequiredEnv("SUPABASE_STORAGE_BUCKET"),
    email,
    supabase: createSupabaseClient(url, serviceRoleKey),
  };
}

function asObject(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new MouRequestError(message);
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown, fieldName: string, required = false) {
  if (typeof value !== "string") {
    if (required) {
      throw new MouRequestError(`Invalid ${fieldName}.`);
    }

    return "";
  }

  const nextValue = value.trim();

  if (required && !nextValue) {
    throw new MouRequestError(`${fieldName} is required.`);
  }

  return nextValue;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeRoute(type: MouSubmissionType, route: string[]) {
  if (route.length > 0) {
    return route;
  }

  return type === "global_deal"
    ? ["Direct Global Deal Membership Request"]
    : ["Direct Creator Passport Membership Request"];
}

function normalizeMembershipCopy(value: string) {
  return value.replaceAll("MOU", "Membership");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseIssuePayload(input: unknown): MouIssuePayload {
  const body = asObject(input, "Invalid request body.");
  const type = asString(body.type, "type", true);
  const route = sanitizeRoute(
    type === "global_deal" ? "global_deal" : "creator",
    asStringArray(body.route),
  );
  const signatureImage = asString(body.signatureImage, "signatureImage", true);

  if (!signatureImage.startsWith("data:image/")) {
    throw new MouRequestError("Invalid signatureImage.");
  }

  if (type === "global_deal") {
    const formData = asObject(body.formData, "Invalid global deal form data.");
    const selections = asObject(body.selections, "Invalid global deal selections.");
    const email = asString(formData.email, "email", true);

    if (!isValidEmail(email)) {
      throw new MouRequestError("Please provide a valid email address.");
    }

    return {
      formData: {
        companyName: asString(formData.companyName, "companyName", true),
        contactName: asString(formData.contactName, "contactName", true),
        country: asString(formData.country, "country"),
        email,
        website: asString(formData.website, "website"),
      },
      route,
      selections: {
        category: asString(selections.category, "category"),
        goal: asString(selections.goal, "goal"),
        market: asString(selections.market, "market"),
      },
      signatureImage,
      type: "global_deal",
    };
  }

  if (type === "creator") {
    const formData = asObject(body.formData, "Invalid creator form data.");
    const selections = asObject(body.selections, "Invalid creator selections.");
    const email = asString(formData.email, "email", true);

    if (!isValidEmail(email)) {
      throw new MouRequestError("Please provide a valid email address.");
    }

    return {
      formData: {
        country: asString(formData.country, "country"),
        creatorName: asString(formData.creatorName, "creatorName", true),
        email,
        mainChannel: asString(formData.mainChannel, "mainChannel"),
        shortBio: asString(formData.shortBio, "shortBio"),
        snsLink: asString(formData.snsLink, "snsLink"),
      },
      route,
      selections: {
        category: asString(selections.category, "category"),
        channel: asString(selections.channel, "channel"),
        goal: asString(selections.goal, "goal"),
        region: asString(selections.region, "region"),
      },
      signatureImage,
      type: "creator",
    };
  }

  throw new MouRequestError("Unsupported membership type.");
}

function parseResendInput(input: unknown) {
  const body = asObject(input, "Invalid request body.");
  return {
    submissionId: asString(body.submissionId, "submissionId", true),
  };
}

function createTokenId(type: MouSubmissionType) {
  const year = new Date().getFullYear();
  const sequence = String(randomInt(1, 1_000_000)).padStart(6, "0");

  return type === "global_deal"
    ? `HP-DEAL-${year}-${sequence}`
    : `HP-CREATOR-${year}-${sequence}`;
}

function hashHex(input: string | Buffer) {
  return createHash("sha256").update(input).digest("hex");
}

function toJsonString(value: unknown) {
  return JSON.stringify(value, null, 0);
}

function decodeSignatureImage(signatureImage: string) {
  const match = signatureImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    throw new MouRequestError("Invalid signature image format.");
  }

  const [, contentType, base64Value] = match;
  const buffer = Buffer.from(base64Value, "base64");
  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/webp": "webp",
  };

  return {
    buffer,
    contentType,
    extension: extensionMap[contentType] ?? "png",
  };
}

function toRouteSummary(route: string[]) {
  return route.join(" -> ");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatIssuedAt(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}

function describeBlockchainStatus(blockchain: MouBlockchainReceipt) {
  if (blockchain.status === "anchored") {
    return "Anchored on-chain";
  }

  if (blockchain.status === "failed") {
    return `Anchor failed${blockchain.error ? `: ${blockchain.error}` : ""}`;
  }

  return "Not configured";
}

function buildFieldTable(fields: Array<{ label: string; value: string }>) {
  return fields
    .map(
      (field) => `
        <tr>
          <td style="padding:8px 0;color:#94a3b8;font-size:12px;vertical-align:top;">${escapeHtml(field.label)}</td>
          <td style="padding:8px 0;color:#e2e8f0;font-size:13px;text-align:right;vertical-align:top;">${escapeHtml(field.value || "-")}</td>
        </tr>
      `,
    )
    .join("");
}

function buildEmailMessage(record: SubmissionRecord, audience: "user" | "admin"): EmailMessage {
  const intro =
    record.type === "global_deal"
      ? "Your Global Deal Token has been issued and your membership record has been verified."
      : "Your Creator Passport Token has been issued and your creator membership record has been verified.";
  const adminIntro =
    record.type === "global_deal"
      ? "A new Global Deal membership submission has been issued."
      : "A new Creator membership submission has been issued.";
  const fields =
    record.type === "global_deal"
      ? [
          { label: "Token ID", value: record.tokenId },
          { label: "Membership Type", value: record.mouType },
          { label: "Company", value: record.companyName },
          { label: "Contact", value: record.contactName },
          { label: "Email", value: record.email },
          { label: "Country", value: record.country },
          { label: "Website", value: record.website },
          { label: "Market", value: record.market },
          { label: "Category", value: record.category },
          { label: "Goal", value: record.goal },
          { label: "Route Summary", value: toRouteSummary(record.route) },
          { label: "Document Hash", value: record.documentHash },
          { label: "Issued At", value: formatIssuedAt(record.issuedAt) },
          { label: "Blockchain", value: describeBlockchainStatus(record.blockchain) },
        ]
      : [
          { label: "Token ID", value: record.tokenId },
          { label: "Membership Type", value: record.mouType },
          { label: "Creator", value: record.creatorName },
          { label: "Email", value: record.email },
          { label: "Country", value: record.country },
          { label: "Main Channel", value: record.mainChannel },
          { label: "SNS Link", value: record.snsLink },
          { label: "Category", value: record.category },
          { label: "Goal", value: record.goal },
          { label: "Region", value: record.region },
          { label: "Route Summary", value: toRouteSummary(record.route) },
          { label: "Document Hash", value: record.documentHash },
          { label: "Issued At", value: formatIssuedAt(record.issuedAt) },
          { label: "Blockchain", value: describeBlockchainStatus(record.blockchain) },
        ];
  const blockchainFields =
    record.blockchain.status === "anchored"
      ? [
          { label: "Network", value: record.blockchain.networkName || "-" },
          { label: "Chain ID", value: String(record.blockchain.chainId ?? "-") },
          { label: "Registry", value: record.blockchain.registryAddress || "-" },
          { label: "Transaction Hash", value: record.blockchain.transactionHash || "-" },
        ]
      : [];
  const title =
    record.type === "global_deal"
      ? "Hitpick Global Deal Membership"
      : "Hitpick Creator Passport Membership";

  return {
    html: `
      <div style="background:#020617;padding:32px;font-family:Inter,Arial,sans-serif;color:#e2e8f0;">
        <div style="max-width:640px;margin:0 auto;border:1px solid rgba(148,163,184,0.2);border-radius:20px;background:#0f172a;padding:28px;">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#60a5fa;">
            ${audience === "admin" ? "Admin Alert" : "Verification Certificate"}
          </p>
          <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;color:#f8fafc;">${escapeHtml(title)}</h1>
          <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
            ${escapeHtml(audience === "admin" ? adminIntro : intro)}
          </p>
          <table style="width:100%;border-collapse:collapse;">
            ${buildFieldTable([...fields, ...blockchainFields])}
          </table>
          <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(148,163,184,0.18);">
            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">${escapeHtml(CERTIFICATE_NOTICE)}</p>
          </div>
        </div>
      </div>
    `,
    subject:
      audience === "admin"
        ? `[Hitpick Admin] New ${record.mouType} issued - ${record.tokenId}`
        : `[Hitpick] ${title} issued - ${record.tokenId}`,
    text: [
      audience === "admin" ? adminIntro : intro,
      "",
      ...fields.map((field) => `${field.label}: ${field.value || "-"}`),
      ...blockchainFields.map((field) => `${field.label}: ${field.value || "-"}`),
      "",
      CERTIFICATE_NOTICE,
    ].join("\n"),
  };
}

async function uploadSignature(
  services: ResolvedServices,
  type: MouSubmissionType,
  tokenId: string,
  signatureImage: string,
) {
  const { buffer, contentType, extension } = decodeSignatureImage(signatureImage);
  const now = new Date().toISOString().replaceAll(":", "-");
  const filePath = `${type}/${tokenId}-${now}.${extension}`;
  const { error } = await services.supabase.storage
    .from(services.bucket)
    .upload(filePath, buffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload signature image: ${error.message}`);
  }

  const publicUrl = services.supabase.storage.from(services.bucket).getPublicUrl(filePath).data
    .publicUrl;

  return {
    signatureHash: hashHex(buffer),
    signatureUrl: publicUrl || null,
  };
}

function buildSubmissionRecord(
  payload: GlobalDealIssuePayload | CreatorIssuePayload,
  signatureUrl: string | null,
  signatureHash: string,
  tokenId: string,
) {
  const issuedAt = new Date().toISOString();
  const proofType: ProofType =
    payload.type === "global_deal" ? "global_deal_token" : "creator_passport_token";
  const mouType = payload.type === "global_deal" ? GLOBAL_MOU_TYPE : CREATOR_MOU_TYPE;

  if (payload.type === "global_deal") {
    const formData: GlobalDealFormData = payload.formData;
    const selections: GlobalDealSelections = payload.selections;
    const documentHash = hashHex(
      toJsonString({
        formData,
        issuedAt,
        mouType,
        proofType,
        route: payload.route,
        selections,
        signatureHash,
        tokenId,
        type: payload.type,
      }),
    );

    return {
      adminEmailSent: false,
      blockchain: createDefaultBlockchainReceipt(),
      category: selections.category,
      companyName: formData.companyName,
      contactName: formData.contactName,
      country: formData.country,
      creatorName: "",
      documentHash,
      email: formData.email,
      emailSent: false,
      goal: selections.goal,
      id: "",
      issuedAt,
      mainChannel: "",
      market: selections.market,
      mouType,
      name: formData.contactName || formData.companyName,
      proofType,
      rawPayload: {
        formData,
        route: payload.route,
        selections,
        signatureProvided: true,
        type: payload.type,
      },
      region: "",
      route: payload.route,
      signatureHash,
      signatureUrl,
      snsLink: "",
      status: "issued",
      tokenId,
      type: payload.type,
      website: formData.website,
    } satisfies SubmissionRecord;
  }

  const formData: CreatorFormData = payload.formData;
  const selections: CreatorSelections = payload.selections;
  const documentHash = hashHex(
    toJsonString({
      formData,
      issuedAt,
      mouType,
      proofType,
      route: payload.route,
      selections,
      signatureHash,
      tokenId,
      type: payload.type,
    }),
  );

  return {
    adminEmailSent: false,
    blockchain: createDefaultBlockchainReceipt(),
    category: selections.category,
    companyName: "",
    contactName: "",
    country: formData.country,
    creatorName: formData.creatorName,
    documentHash,
    email: formData.email,
    emailSent: false,
    goal: selections.goal,
    id: "",
    issuedAt,
    mainChannel: formData.mainChannel || selections.channel,
    market: "",
    mouType,
    name: formData.creatorName,
    proofType,
    rawPayload: {
      formData,
      route: payload.route,
      selections,
      signatureProvided: true,
      type: payload.type,
    },
    region: selections.region,
    route: payload.route,
    signatureHash,
    signatureUrl,
    snsLink: formData.snsLink,
    status: "issued",
    tokenId,
    type: payload.type,
    website: "",
  } satisfies SubmissionRecord;
}

function toInsertRow(record: SubmissionRecord) {
  return {
    admin_email_sent: record.adminEmailSent,
    anchored_at: record.blockchain.anchoredAt,
    anchor_error: record.blockchain.error,
    block_number: record.blockchain.blockNumber,
    blockchain_status: record.blockchain.status,
    category: record.category || null,
    chain_id: record.blockchain.chainId,
    company_name: record.companyName || null,
    contact_name: record.contactName || null,
    country: record.country || null,
    creator_name: record.creatorName || null,
    document_hash: record.documentHash,
    email: record.email,
    email_sent: record.emailSent,
    goal: record.goal || null,
    issued_at: record.issuedAt,
    main_channel: record.mainChannel || null,
    market: record.market || null,
    mou_type: record.mouType,
    network_name: record.blockchain.networkName,
    name: record.name || null,
    proof_type: record.proofType,
    proof_key: record.blockchain.proofKey,
    raw_payload: record.rawPayload,
    registry_address: record.blockchain.registryAddress,
    region: record.region || null,
    route: record.route,
    route_hash: record.blockchain.routeHash,
    signature_hash: record.signatureHash,
    signature_url: record.signatureUrl,
    sns_link: record.snsLink || null,
    status: record.status,
    subject_hash: record.blockchain.subjectHash,
    token_id: record.tokenId,
    transaction_hash: record.blockchain.transactionHash,
    transaction_url: record.blockchain.transactionUrl,
    type: record.type,
    updated_at: new Date().toISOString(),
    website: record.website || null,
  };
}

async function insertSubmission(
  services: ResolvedServices,
  record: SubmissionRecord,
): Promise<SubmissionRecord> {
  const { data, error } = await services.supabase
    .from("mou_submissions")
    .insert(toInsertRow(record))
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to store membership submission: ${error?.message ?? "Unknown error"}`);
  }

  return fromDbRow(data as DbSubmissionRow);
}

async function updateEmailStatus(
  services: ResolvedServices,
  submissionId: string,
  status: EmailDeliveryStatus,
) {
  const { error } = await services.supabase
    .from("mou_submissions")
    .update({
      admin_email_sent: status.adminEmailSent,
      email_sent: status.emailSent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) {
    throw new Error(`Failed to update email status: ${error.message}`);
  }
}

async function updateBlockchainReceipt(
  services: ResolvedServices,
  submissionId: string,
  blockchain: MouBlockchainReceipt,
) {
  const { error } = await services.supabase
    .from("mou_submissions")
    .update({
      anchored_at: blockchain.anchoredAt,
      anchor_error: blockchain.error,
      block_number: blockchain.blockNumber,
      blockchain_status: blockchain.status,
      chain_id: blockchain.chainId,
      network_name: blockchain.networkName,
      proof_key: blockchain.proofKey,
      registry_address: blockchain.registryAddress,
      route_hash: blockchain.routeHash,
      subject_hash: blockchain.subjectHash,
      transaction_hash: blockchain.transactionHash,
      transaction_url: blockchain.transactionUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) {
    throw new Error(`Failed to update blockchain status: ${error.message}`);
  }
}

async function sendEmails(
  services: ResolvedServices,
  record: SubmissionRecord,
): Promise<EmailDeliveryStatus> {
  if (!services.email) {
    return {
      adminEmailSent: false,
      emailSent: false,
    };
  }

  const userMessage = buildEmailMessage(record, "user");
  const adminMessage = buildEmailMessage(record, "admin");
  const [userResult, adminResult] = await Promise.allSettled([
    services.email.resend.emails.send({
      from: services.email.emailFrom,
      html: userMessage.html,
      subject: userMessage.subject,
      text: userMessage.text,
      to: record.email,
    }),
    services.email.resend.emails.send({
      from: services.email.emailFrom,
      html: adminMessage.html,
      subject: adminMessage.subject,
      text: adminMessage.text,
      to: services.email.adminEmail,
    }),
  ]);

  const emailSent =
    userResult.status === "fulfilled" && !userResult.value.error;
  const adminEmailSent =
    adminResult.status === "fulfilled" && !adminResult.value.error;

  return { adminEmailSent, emailSent };
}

function normalizeRoute(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeJson(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : {};
}

function fromDbRow(row: DbSubmissionRow): SubmissionRecord {
  return {
    adminEmailSent: Boolean(row.admin_email_sent),
    blockchain: {
      anchoredAt: row.anchored_at,
      blockNumber: row.block_number,
      chainId: row.chain_id,
      error: row.anchor_error,
      networkName: row.network_name,
      proofKey: row.proof_key,
      registryAddress: row.registry_address,
      routeHash: row.route_hash,
      status: row.blockchain_status ?? "not_configured",
      subjectHash: row.subject_hash,
      transactionHash: row.transaction_hash,
      transactionUrl: row.transaction_url,
    },
    category: row.category ?? "",
    companyName: row.company_name ?? "",
    contactName: row.contact_name ?? "",
    country: row.country ?? "",
    creatorName: row.creator_name ?? "",
    documentHash: row.document_hash,
    email: row.email,
    emailSent: Boolean(row.email_sent),
    goal: normalizeMembershipCopy(row.goal ?? ""),
    id: row.id,
    issuedAt: row.issued_at,
    mainChannel: row.main_channel ?? "",
    market: row.market ?? "",
    mouType: normalizeMembershipCopy(row.mou_type),
    name: row.name ?? "",
    proofType: row.proof_type,
    rawPayload: normalizeJson(row.raw_payload),
    region: row.region ?? "",
    route: normalizeRoute(row.route).map(normalizeMembershipCopy),
    signatureHash: row.signature_hash ?? "",
    signatureUrl: row.signature_url,
    snsLink: row.sns_link ?? "",
    status: row.status,
    tokenId: row.token_id,
    type: row.type,
    website: row.website ?? "",
  };
}

function toIssuedToken(record: SubmissionRecord): IssuedMouToken {
  const rawSelections =
    record.rawPayload.selections &&
    typeof record.rawPayload.selections === "object" &&
    !Array.isArray(record.rawPayload.selections)
      ? (record.rawPayload.selections as JsonObject)
      : {};
  const rawFormData =
    record.rawPayload.formData &&
    typeof record.rawPayload.formData === "object" &&
    !Array.isArray(record.rawPayload.formData)
      ? (record.rawPayload.formData as JsonObject)
      : {};
  const base = {
    adminEmailSent: record.adminEmailSent,
    blockchain: record.blockchain,
    documentHash: record.documentHash,
    emailSent: record.emailSent,
    issuedAt: record.issuedAt,
    mouType: record.mouType,
    notice: CERTIFICATE_NOTICE,
    proofType: record.proofType,
    route: record.route,
    routeSummary: toRouteSummary(record.route),
    signatureUrl: record.signatureUrl,
    status: record.status,
    submissionId: record.id,
    tokenId: record.tokenId,
  };

  if (record.type === "global_deal") {
    return {
      ...base,
      category: record.category,
      companyName: record.companyName,
      contactName: record.contactName,
      country: record.country,
      email: record.email,
      goal: record.goal,
      market: record.market,
      proofType: "global_deal_token",
      type: "global_deal",
      website: record.website,
    } satisfies GlobalDealIssuedToken;
  }

  return {
    ...base,
    category: record.category,
    channel: String(rawSelections.channel ?? ""),
    country: record.country,
    creatorName: record.creatorName,
    email: record.email,
    goal: record.goal,
    mainChannel: record.mainChannel,
    proofType: "creator_passport_token",
    region: record.region,
    shortBio: String(rawFormData.shortBio ?? ""),
    snsLink: record.snsLink,
    type: "creator",
  } satisfies CreatorIssuedToken;
}

function createBlockchainSubjectSummary(record: SubmissionRecord) {
  if (record.type === "global_deal") {
    return [record.companyName, record.contactName, record.email, record.tokenId].join("|");
  }

  return [record.creatorName, record.email, record.mainChannel, record.tokenId].join("|");
}

function buildIssueWarning(
  blockchain: MouBlockchainReceipt,
  emailConfigured: boolean,
  delivery: EmailDeliveryStatus,
) {
  const warnings: string[] = [];

  if (blockchain.status === "not_configured") {
    warnings.push(
      "Blockchain anchoring is skipped until BLOCKCHAIN_RPC_URL, BLOCKCHAIN_PRIVATE_KEY, and MOU_REGISTRY_ADDRESS are configured.",
    );
  } else if (blockchain.status === "failed") {
    warnings.push(
      `Blockchain anchoring failed${blockchain.error ? `: ${blockchain.error}` : "."}`,
    );
  }

  if (!emailConfigured) {
    warnings.push(
      "Email delivery is skipped until RESEND_API_KEY, EMAIL_FROM, and ADMIN_EMAIL are configured.",
    );
  } else if (!delivery.emailSent || !delivery.adminEmailSent) {
    warnings.push("One or more email deliveries need attention.");
  }

  return warnings.length > 0 ? `Token issued and saved to Supabase. ${warnings.join(" ")}` : undefined;
}

export async function issueMouSubmission(input: unknown): Promise<IssueResult> {
  const payload = parseIssuePayload(input);
  const services = getServices();
  const tokenId = createTokenId(payload.type);
  const signature = await uploadSignature(services, payload.type, tokenId, payload.signatureImage);
  const draftRecord = buildSubmissionRecord(
    payload,
    signature.signatureUrl,
    signature.signatureHash,
    tokenId,
  );
  const insertedRecord = await insertSubmission(services, draftRecord);
  const blockchain = await anchorMouProofOnChain({
    documentHash: insertedRecord.documentHash,
    issuedAt: insertedRecord.issuedAt,
    mouType: insertedRecord.mouType,
    proofType: insertedRecord.proofType,
    route: insertedRecord.route,
    subjectSummary: createBlockchainSubjectSummary(insertedRecord),
    tokenId: insertedRecord.tokenId,
  });
  await updateBlockchainReceipt(services, insertedRecord.id, blockchain);
  const anchoredRecord: SubmissionRecord = {
    ...insertedRecord,
    blockchain,
  };
  const delivery = await sendEmails(services, anchoredRecord);

  await updateEmailStatus(services, insertedRecord.id, delivery);

  const finalRecord: SubmissionRecord = {
    ...anchoredRecord,
    ...delivery,
  };
  const emailConfigured = Boolean(services.email);

  return {
    token: toIssuedToken(finalRecord),
    warning: buildIssueWarning(blockchain, emailConfigured, delivery),
  };
}

async function findSubmissionById(
  services: ResolvedServices,
  submissionId: string,
): Promise<SubmissionRecord> {
  const { data, error } = await services.supabase
    .from("mou_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (error || !data) {
    throw new MouRequestError("Membership submission not found.");
  }

  return fromDbRow(data as DbSubmissionRow);
}

export async function resendMouEmails(input: unknown): Promise<ResendResult> {
  const { submissionId } = parseResendInput(input);
  const services = getServices();

  if (!services.email) {
    throw new MouRequestError(
      "Email delivery is not configured yet. Add RESEND_API_KEY, EMAIL_FROM, and ADMIN_EMAIL first.",
    );
  }

  const record = await findSubmissionById(services, submissionId);
  const delivery = await sendEmails(services, record);

  await updateEmailStatus(services, submissionId, delivery);

  return delivery;
}

export async function getIssuedMouTokenBySubmissionId(
  submissionId: string,
): Promise<IssuedMouToken> {
  const services = getServices();
  const record = await findSubmissionById(services, submissionId);

  return toIssuedToken(record);
}
