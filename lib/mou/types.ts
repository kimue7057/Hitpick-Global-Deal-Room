export const CERTIFICATE_NOTICE =
  "This certificate is issued for verification purposes only and does not represent ownership, investment rights, revenue share, or IP rights.";

export type MouSubmissionType = "global_deal" | "creator";
export type ProofType = "global_deal_token" | "creator_passport_token";

export interface GlobalDealFormData {
  companyName: string;
  contactName: string;
  country: string;
  email: string;
  website: string;
}

export interface GlobalDealSelections {
  category: string;
  goal: string;
  market: string;
}

export interface CreatorFormData {
  country: string;
  creatorName: string;
  email: string;
  mainChannel: string;
  shortBio: string;
  snsLink: string;
}

export interface CreatorSelections {
  category: string;
  channel: string;
  goal: string;
  region: string;
}

export type MouBlockchainStatus = "anchored" | "failed" | "not_configured";

export interface MouBlockchainReceipt {
  anchoredAt: string | null;
  blockNumber: number | null;
  chainId: number | null;
  error: string | null;
  networkName: string | null;
  proofKey: string | null;
  registryAddress: string | null;
  routeHash: string | null;
  status: MouBlockchainStatus;
  subjectHash: string | null;
  transactionHash: string | null;
  transactionUrl: string | null;
}

interface BaseIssuePayload<TType extends MouSubmissionType> {
  route: string[];
  signatureImage: string;
  type: TType;
}

export interface GlobalDealIssuePayload extends BaseIssuePayload<"global_deal"> {
  formData: GlobalDealFormData;
  selections: GlobalDealSelections;
}

export interface CreatorIssuePayload extends BaseIssuePayload<"creator"> {
  formData: CreatorFormData;
  selections: CreatorSelections;
}

export type MouIssuePayload = GlobalDealIssuePayload | CreatorIssuePayload;

interface BaseIssuedToken<TType extends MouSubmissionType, TProofType extends ProofType> {
  adminEmailSent: boolean;
  blockchain: MouBlockchainReceipt;
  documentHash: string;
  emailSent: boolean;
  issuedAt: string;
  mouType: string;
  notice: string;
  proofType: TProofType;
  route: string[];
  routeSummary: string;
  signatureUrl: string | null;
  status: string;
  submissionId: string;
  tokenId: string;
  type: TType;
}

export interface GlobalDealIssuedToken
  extends BaseIssuedToken<"global_deal", "global_deal_token">,
    GlobalDealFormData,
    GlobalDealSelections {}

export interface CreatorIssuedToken
  extends BaseIssuedToken<"creator", "creator_passport_token">,
    CreatorFormData {
  category: string;
  channel: string;
  goal: string;
  region: string;
}

export type IssuedMouToken = GlobalDealIssuedToken | CreatorIssuedToken;

export type MouIssueResponse =
  | {
      ok: true;
      token: IssuedMouToken;
      warning?: string;
    }
  | {
      error: string;
      ok: false;
    };

export interface MouResendRequest {
  submissionId: string;
}

export type MouResendResponse =
  | {
      adminEmailSent: boolean;
      emailSent: boolean;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };
