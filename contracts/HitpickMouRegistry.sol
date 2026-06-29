// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error HitpickRegistryAlreadyIssued();
error HitpickRegistryNotOwner();
error HitpickRegistryNotFound();

contract HitpickMouRegistry {
    struct Proof {
        string tokenId;
        bytes32 documentHash;
        bytes32 routeHash;
        bytes32 subjectHash;
        string proofType;
        string mouType;
        uint64 issuedAt;
        uint64 anchoredAt;
        address issuer;
        bool exists;
        bool revoked;
    }

    address public owner;

    mapping(bytes32 => Proof) private proofs;
    mapping(bytes32 => string) public revokeReasons;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ProofIssued(
        bytes32 indexed tokenKey,
        string tokenId,
        bytes32 indexed documentHash,
        string proofType,
        string mouType,
        uint64 issuedAt,
        uint64 anchoredAt,
        address issuer
    );
    event ProofRevoked(bytes32 indexed tokenKey, string tokenId, string reason);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert HitpickRegistryNotOwner();
        }
        _;
    }

    constructor(address initialOwner) {
        owner = initialOwner == address(0) ? msg.sender : initialOwner;
        emit OwnershipTransferred(address(0), owner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) {
            revert HitpickRegistryNotOwner();
        }

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function tokenKey(string memory tokenId) public pure returns (bytes32) {
        return keccak256(bytes(tokenId));
    }

    function issueProof(
        string calldata tokenId,
        bytes32 documentHash,
        bytes32 routeHash,
        bytes32 subjectHash,
        string calldata proofType,
        string calldata mouType,
        uint64 issuedAt
    ) external onlyOwner returns (bytes32 key) {
        key = tokenKey(tokenId);

        if (proofs[key].exists) {
            revert HitpickRegistryAlreadyIssued();
        }

        uint64 anchoredAt = uint64(block.timestamp);

        proofs[key] = Proof({
            tokenId: tokenId,
            documentHash: documentHash,
            routeHash: routeHash,
            subjectHash: subjectHash,
            proofType: proofType,
            mouType: mouType,
            issuedAt: issuedAt,
            anchoredAt: anchoredAt,
            issuer: msg.sender,
            exists: true,
            revoked: false
        });

        emit ProofIssued(
            key,
            tokenId,
            documentHash,
            proofType,
            mouType,
            issuedAt,
            anchoredAt,
            msg.sender
        );
    }

    function revokeProof(string calldata tokenId, string calldata reason) external onlyOwner {
        bytes32 key = tokenKey(tokenId);
        Proof storage proof = proofs[key];

        if (!proof.exists) {
            revert HitpickRegistryNotFound();
        }

        proof.revoked = true;
        revokeReasons[key] = reason;

        emit ProofRevoked(key, tokenId, reason);
    }

    function getProof(string calldata tokenId) external view returns (Proof memory) {
        bytes32 key = tokenKey(tokenId);
        Proof memory proof = proofs[key];

        if (!proof.exists) {
            revert HitpickRegistryNotFound();
        }

        return proof;
    }

    function verifyProof(
        string calldata tokenId,
        bytes32 documentHash
    ) external view returns (bool valid, bool revoked) {
        bytes32 key = tokenKey(tokenId);
        Proof memory proof = proofs[key];

        if (!proof.exists) {
            return (false, false);
        }

        return (proof.documentHash == documentHash, proof.revoked);
    }
}
