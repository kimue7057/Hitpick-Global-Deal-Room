import "server-only";

import { createHash, randomInt } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import {
  CERTIFICATE_NOTICE,
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
  category: string | null;
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
  name: string | null;
  proof_type: ProofType;
  raw_payload: unknown;
  region: string | null;
  route: unknown;
  signature_hash: string | null;
  signature_url: string | null;
  sns_link: string | null;
  status: string;
  token_id: string;
  type: MouSubmissionType;
  updated_at: string;
  website: string | null;
};

type SubmissionRecord = {
  adminEmailSent: boolean;
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

type ResolvedServices = {
  adminEmail: string;
  bucket: string;
  emailFrom: string;
  resend: Resend;
  supabase: ReturnType<typeof createSupabaseClient>;
};

const GLOBAL_MOU_TYPE = "Global Partnership Interest MOU";
const CREATOR_MOU_TYPE = "Creator Network Participation MOU";

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

function getServices(): ResolvedServices {
  const url = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return {
    adminEmail: getRequiredEnv("ADMIN_EMAIL"),
    bucket: getRequiredEnv("SUPABASE_STORAGE_BUCKET"),
    emailFrom: getRequiredEnv("EMAIL_FROM"),
    resend: new Resend(getRequiredEnv("RESEND_API_KEY")),
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
    ? ["Direct Global Deal MOU Request"]
    : ["Direct Creator Passport MOU Request"];
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

  throw new MouRequestError("Unsupported MOU type.");
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
      ? "Your Global Deal Token has been issued and your MOU record has been verified."
      : "Your Creator Passport Token has been issued and your creator MOU record has been verified.";
  const adminIntro =
    record.type === "global_deal"
      ? "A new Global Deal MOU submission has been issued."
      : "A new Creator MOU submission has been issued.";
  const fields =
    record.type === "global_deal"
      ? [
          { label: "Token ID", value: record.tokenId },
          { label: "MOU Type", value: record.mouType },
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
        ]
      : [
          { label: "Token ID", value: record.tokenId },
          { label: "MOU Type", value: record.mouType },
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
        ];
  const title =
    record.type === "global_deal"
      ? "Hitpick Global Deal Token"
      : "Hitpick Creator Passport Token";

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
            ${buildFieldTable(fields)}
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
    category: record.category || null,
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
    name: record.name || null,
    proof_type: record.proofType,
    raw_payload: record.rawPayload,
    region: record.region || null,
    route: record.route,
    signature_hash: record.signatureHash,
    signature_url: record.signatureUrl,
    sns_link: record.snsLink || null,
    status: record.status,
    token_id: record.tokenId,
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
    throw new Error(`Failed to store MOU submission: ${error?.message ?? "Unknown error"}`);
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

async function sendEmails(
  services: ResolvedServices,
  record: SubmissionRecord,
): Promise<EmailDeliveryStatus> {
  const userMessage = buildEmailMessage(record, "user");
  const adminMessage = buildEmailMessage(record, "admin");
  const [userResult, adminResult] = await Promise.allSettled([
    services.resend.emails.send({
      from: services.emailFrom,
      html: userMessage.html,
      subject: userMessage.subject,
      text: userMessage.text,
      to: record.email,
    }),
    services.resend.emails.send({
      from: services.emailFrom,
      html: adminMessage.html,
      subject: adminMessage.subject,
      text: adminMessage.text,
      to: services.adminEmail,
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
    category: row.category ?? "",
    companyName: row.company_name ?? "",
    contactName: row.contact_name ?? "",
    country: row.country ?? "",
    creatorName: row.creator_name ?? "",
    documentHash: row.document_hash,
    email: row.email,
    emailSent: Boolean(row.email_sent),
    goal: row.goal ?? "",
    id: row.id,
    issuedAt: row.issued_at,
    mainChannel: row.main_channel ?? "",
    market: row.market ?? "",
    mouType: row.mou_type,
    name: row.name ?? "",
    proofType: row.proof_type,
    rawPayload: normalizeJson(row.raw_payload),
    region: row.region ?? "",
    route: normalizeRoute(row.route),
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
  const delivery = await sendEmails(services, insertedRecord);

  await updateEmailStatus(services, insertedRecord.id, delivery);

  const finalRecord: SubmissionRecord = {
    ...insertedRecord,
    ...delivery,
  };

  return {
    token: toIssuedToken(finalRecord),
    warning:
      delivery.emailSent && delivery.adminEmailSent
        ? undefined
        : "Token issued, but one or more email deliveries need attention.",
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
    throw new MouRequestError("MOU submission not found.");
  }

  return fromDbRow(data as DbSubmissionRow);
}

export async function resendMouEmails(input: unknown): Promise<ResendResult> {
  const { submissionId } = parseResendInput(input);
  const services = getServices();
  const record = await findSubmissionById(services, submissionId);
  const delivery = await sendEmails(services, record);

  await updateEmailStatus(services, submissionId, delivery);

  return delivery;
}
