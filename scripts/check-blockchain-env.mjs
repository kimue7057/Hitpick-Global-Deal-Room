import { JsonRpcProvider, Wallet, formatEther } from "ethers";

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(name) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function parseExpectedChainId(value) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("BLOCKCHAIN_EXPECTED_CHAIN_ID must be a positive integer like 137.");
  }

  return parsed;
}

function shortenAddress(value) {
  if (!value) {
    return "-";
  }

  return value.length > 12 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value;
}

async function main() {
  const rpcUrl = getRequiredEnv("BLOCKCHAIN_RPC_URL");
  const privateKey = getRequiredEnv("BLOCKCHAIN_PRIVATE_KEY");
  const networkName = getOptionalEnv("BLOCKCHAIN_NETWORK_NAME");
  const registryAddress = getOptionalEnv("MOU_REGISTRY_ADDRESS");
  const expectedChainId = parseExpectedChainId(getOptionalEnv("BLOCKCHAIN_EXPECTED_CHAIN_ID"));
  const provider = new JsonRpcProvider(rpcUrl);
  const signer = new Wallet(privateKey, provider);
  const [network, balance] = await Promise.all([
    provider.getNetwork(),
    provider.getBalance(signer.address),
  ]);
  const chainId = Number(network.chainId);
  const registryCode =
    registryAddress !== null ? await provider.getCode(registryAddress) : null;

  console.log(`networkName=${networkName ?? "-"}`);
  console.log(`chainId=${chainId}`);
  console.log(`expectedChainId=${expectedChainId ?? "-"}`);
  console.log(`wallet=${signer.address}`);
  console.log(`walletBalancePOL=${formatEther(balance)}`);
  console.log(`registryAddress=${shortenAddress(registryAddress)}`);
  console.log(
    `registryCodePresent=${registryAddress ? (registryCode && registryCode !== "0x" ? "yes" : "no") : "not_set"}`,
  );

  if (expectedChainId !== null && chainId !== expectedChainId) {
    throw new Error(
      `Connected chain ${chainId} does not match BLOCKCHAIN_EXPECTED_CHAIN_ID=${expectedChainId}.`,
    );
  }

  if (balance <= 0n) {
    throw new Error(
      `Wallet ${signer.address} has no native balance on chain ${chainId}. Fund it with POL before deployment or anchoring.`,
    );
  }
}

await main();
