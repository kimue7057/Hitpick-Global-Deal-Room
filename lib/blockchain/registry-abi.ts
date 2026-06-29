export const hitpickMouRegistryAbi = [
  "function issueProof(string tokenId, bytes32 documentHash, bytes32 routeHash, bytes32 subjectHash, string proofType, string mouType, uint64 issuedAt) returns (bytes32)",
  "function getProof(string tokenId) view returns ((string tokenId, bytes32 documentHash, bytes32 routeHash, bytes32 subjectHash, string proofType, string mouType, uint64 issuedAt, uint64 anchoredAt, address issuer, bool exists, bool revoked))",
  "function tokenKey(string tokenId) pure returns (bytes32)",
  "function verifyProof(string tokenId, bytes32 documentHash) view returns (bool valid, bool revoked)",
] as const;
