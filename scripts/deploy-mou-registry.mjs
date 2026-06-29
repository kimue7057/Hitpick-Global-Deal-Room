import fs from "node:fs/promises";
import path from "node:path";

import { ContractFactory, JsonRpcProvider, Wallet } from "ethers";

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

const artifactPath = path.join(
  process.cwd(),
  "artifacts",
  "contracts",
  "HitpickMouRegistry.sol",
  "HitpickMouRegistry.json",
);
const artifact = JSON.parse(await fs.readFile(artifactPath, "utf8"));
const provider = new JsonRpcProvider(getRequiredEnv("BLOCKCHAIN_RPC_URL"));
const signer = new Wallet(getRequiredEnv("BLOCKCHAIN_PRIVATE_KEY"), provider);
const network = await provider.getNetwork();
const owner = getOptionalEnv("BLOCKCHAIN_OWNER_ADDRESS") ?? signer.address;
const factory = new ContractFactory(artifact.abi, artifact.bytecode, signer);

console.log(`Deploying HitpickMouRegistry to chain ${network.chainId.toString()}...`);
console.log(`Deployer: ${signer.address}`);
console.log(`Owner: ${owner}`);

const contract = await factory.deploy(owner);
const deploymentTx = contract.deploymentTransaction();

if (deploymentTx) {
  console.log(`Deployment tx hash: ${deploymentTx.hash}`);
}

await contract.waitForDeployment();

const address = await contract.getAddress();

console.log("");
console.log("Deployment complete");
console.log(`Contract address: ${address}`);
console.log(`MOU_REGISTRY_ADDRESS=${address}`);

const explorerTxBaseUrl = getOptionalEnv("BLOCKCHAIN_EXPLORER_TX_BASE_URL");

if (explorerTxBaseUrl && deploymentTx) {
  console.log(`Explorer tx URL: ${explorerTxBaseUrl.replace(/\/$/, "")}/${deploymentTx.hash}`);
}
