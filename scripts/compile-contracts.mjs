import fs from "node:fs/promises";
import path from "node:path";

import solc from "solc";

const rootDir = process.cwd();
const contractsDir = path.join(rootDir, "contracts");
const artifactsDir = path.join(rootDir, "artifacts", "contracts");
const sources = {};
const contractFiles = (await fs.readdir(contractsDir)).filter((file) => file.endsWith(".sol"));

for (const file of contractFiles) {
  sources[file] = {
    content: await fs.readFile(path.join(contractsDir, file), "utf8"),
  };
}

const input = {
  language: "Solidity",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"],
      },
    },
  },
  sources,
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const outputErrors = output.errors ?? [];
const fatalErrors = outputErrors.filter((item) => item.severity === "error");

for (const item of outputErrors) {
  const logger = item.severity === "error" ? console.error : console.warn;
  logger(item.formattedMessage.trim());
}

if (fatalErrors.length > 0) {
  process.exit(1);
}

let contractCount = 0;

for (const [sourceName, contracts] of Object.entries(output.contracts ?? {})) {
  for (const [contractName, artifact] of Object.entries(contracts)) {
    const targetDir = path.join(artifactsDir, sourceName);
    const targetPath = path.join(targetDir, `${contractName}.json`);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(
      targetPath,
      JSON.stringify(
        {
          abi: artifact.abi,
          bytecode: `0x${artifact.evm.bytecode.object}`,
          compiler: {
            version: solc.version(),
          },
          contractName,
          deployedBytecode: `0x${artifact.evm.deployedBytecode.object}`,
          sourceName,
        },
        null,
        2,
      ),
      "utf8",
    );
    contractCount += 1;
  }
}

console.log(`Compiled ${contractCount} contract(s) to ${artifactsDir}`);
