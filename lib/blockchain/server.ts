import "server-only";

import { Contract, JsonRpcProvider, Wallet, keccak256, toUtf8Bytes } from "ethers";

import { hitpickMouRegistryAbi } from "@/lib/blockchain/registry-abi";
import type { MouBlockchainReceipt, ProofType } from "@/lib/mou/types";

type BlockchainAnchorInput = {
  documentHash: string;
  issuedAt: string;
  mouType: string;
  proofType: ProofType;
  route: string[];
  subjectSummary: string;
  tokenId: string;
};

type BlockchainConfig = {
  confirmations: number;
  explorerTxBaseUrl: string | null;
  networkName: string | null;
  privateKey: string;
  registryAddress: string;
  rpcUrl: string;
};

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function createEmptyReceipt(
  status: MouBlockchainReceipt["status"],
  overrides: Partial<MouBlockchainReceipt> = {},
): MouBlockchainReceipt {
  return {
    anchoredAt: null,
    blockNumber: null,
    chainId: null,
    error: null,
    networkName: null,
    proofKey: null,
    registryAddress: null,
    routeHash: null,
    status,
    subjectHash: null,
    transactionHash: null,
    transactionUrl: null,
    ...overrides,
  };
}

function normalizeHash32(value: string) {
  const normalized = value.startsWith("0x") ? value.slice(2) : value;

  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error("Document hash must be a 32-byte SHA-256 hex string.");
  }

  return `0x${normalized.toLowerCase()}` as `0x${string}`;
}

function resolveBlockchainConfig():
  | { config: BlockchainConfig; error: null }
  | { config: null; error: string | null } {
  const rpcUrl = getOptionalEnv("BLOCKCHAIN_RPC_URL");
  const privateKey = getOptionalEnv("BLOCKCHAIN_PRIVATE_KEY");
  const registryAddress = getOptionalEnv("MOU_REGISTRY_ADDRESS");
  const networkName = getOptionalEnv("BLOCKCHAIN_NETWORK_NAME");
  const explorerTxBaseUrl = getOptionalEnv("BLOCKCHAIN_EXPLORER_TX_BASE_URL");
  const confirmationsValue = getOptionalEnv("BLOCKCHAIN_CONFIRMATIONS");
  const hasAnyConfig = [rpcUrl, privateKey, registryAddress].some(Boolean);

  if (!hasAnyConfig) {
    return { config: null, error: null };
  }

  if (!rpcUrl || !privateKey || !registryAddress) {
    return {
      config: null,
      error:
        "Incomplete blockchain configuration. Add BLOCKCHAIN_RPC_URL, BLOCKCHAIN_PRIVATE_KEY, and MOU_REGISTRY_ADDRESS.",
    };
  }

  const confirmations = Number(confirmationsValue ?? "1");

  return {
    config: {
      confirmations: Number.isFinite(confirmations) && confirmations > 0 ? confirmations : 1,
      explorerTxBaseUrl,
      networkName,
      privateKey,
      registryAddress,
      rpcUrl,
    },
    error: null,
  };
}

export async function anchorMouProofOnChain(
  input: BlockchainAnchorInput,
): Promise<MouBlockchainReceipt> {
  const resolved = resolveBlockchainConfig();

  if (!resolved.config) {
    return createEmptyReceipt(resolved.error ? "failed" : "not_configured", {
      error: resolved.error,
    });
  }

  const { config } = resolved;
  const routeHash = keccak256(toUtf8Bytes(input.route.join(" -> ")));
  const subjectHash = keccak256(toUtf8Bytes(input.subjectSummary));
  const proofKey = keccak256(toUtf8Bytes(input.tokenId));

  try {
    const provider = new JsonRpcProvider(config.rpcUrl);
    const signer = new Wallet(config.privateKey, provider);
    const contract = new Contract(config.registryAddress, hitpickMouRegistryAbi, signer);
    const network = await provider.getNetwork();
    const issuedAtSeconds = Math.floor(new Date(input.issuedAt).getTime() / 1000);
    const transaction = await contract.issueProof(
      input.tokenId,
      normalizeHash32(input.documentHash),
      routeHash,
      subjectHash,
      input.proofType,
      input.mouType,
      BigInt(issuedAtSeconds),
    );
    const receipt = await transaction.wait(config.confirmations);

    return createEmptyReceipt("anchored", {
      anchoredAt: new Date().toISOString(),
      blockNumber: receipt?.blockNumber ? Number(receipt.blockNumber) : null,
      chainId: Number(network.chainId),
      networkName: config.networkName,
      proofKey,
      registryAddress: config.registryAddress,
      routeHash,
      subjectHash,
      transactionHash: transaction.hash,
      transactionUrl: config.explorerTxBaseUrl
        ? `${config.explorerTxBaseUrl.replace(/\/$/, "")}/${transaction.hash}`
        : null,
    });
  } catch (error) {
    return createEmptyReceipt("failed", {
      error: error instanceof Error ? error.message : "Unknown blockchain anchoring error.",
      networkName: config.networkName,
      proofKey,
      registryAddress: config.registryAddress,
      routeHash,
      subjectHash,
    });
  }
}
