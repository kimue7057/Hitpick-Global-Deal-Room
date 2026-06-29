# Hitpick Global Deal Platform

Current working status for the rebuilt Hitpick site and MOU proof flow.

## Overview

This repository now contains:
- 4-page marketing site rebuilt from the Figma Make ZIP reference
- `Home`, `Global Deal`, `Creator`, `About` routes
- server-side MOU issuance flow
- Supabase storage + database persistence
- Polygon Amoy blockchain anchoring for issued proofs

Important architecture note:
- the current blockchain model is an EVM proof registry
- it is not an ERC-20, ERC-721, or SBT minting flow
- each MOU issuance stores proof metadata on-chain through a registry contract

## Current Routes

- `/`
- `/global-deal`
- `/creator`
- `/about`

Production URL:
- [https://hitpick-global-deal-room.vercel.app/](https://hitpick-global-deal-room.vercel.app/)

## Design Source

Primary design source:
- `reference/make-design/`

The current implementation was adapted from the attached Figma Make ZIP and its page files, not from the legacy Hitpick codebase.

## Current MOU Flow

The active server flow is:
1. user fills the form and signs in the browser
2. frontend sends data to `POST /api/mou/issue`
3. server generates `tokenId`
4. server generates `documentHash`
5. signature image is uploaded to Supabase Storage
6. submission is saved to `mou_submissions`
7. if email env is configured, user/admin email is sent
8. if blockchain env is configured, proof is anchored on Polygon Amoy
9. response is returned to the frontend
10. token-issued UI shows token data and blockchain status

The resend endpoint is:
- `POST /api/mou/resend`

## Blockchain Model

Current chain:
- Polygon Amoy testnet

Current approach:
- proof registry contract, not NFT minting

Stored on-chain:
- `tokenId`
- `documentHash`
- `routeHash`
- `subjectHash`
- `proofType`
- `mouType`
- `issuedAt`

Registry contract:
- address: `0x10212Ec28FfAb4d92fbB790952b08AeaD7bC7050`
- explorer: [Amoy Polygonscan](https://amoy.polygonscan.com/address/0x10212Ec28FfAb4d92fbB790952b08AeaD7bC7050)

Deployment transaction:
- [https://amoy.polygonscan.com/tx/0xb37f98e0c804e482ed3108e4fbe1a0f9edf7c8f0bf4d118e372574de23c685a7](https://amoy.polygonscan.com/tx/0xb37f98e0c804e482ed3108e4fbe1a0f9edf7c8f0bf4d118e372574de23c685a7)

Contract source:
- `contracts/HitpickMouRegistry.sol`

Deployment script:
- `scripts/deploy-mou-registry.mjs`

Compile script:
- `scripts/compile-contracts.mjs`

## Current APIs

### `POST /api/mou/issue`

Supports:
- `global_deal`
- `creator`

Server implementation:
- `app/api/mou/issue/route.ts`
- `lib/mou/server.ts`

### `POST /api/mou/resend`

Resends email for an existing submission when email delivery is configured.

Server implementation:
- `app/api/mou/resend/route.ts`
- `lib/mou/server.ts`

## Database and Storage

Supabase table:
- `mou_submissions`

Base migration:
- `supabase/migrations/20260629_create_mou_submissions.sql`

Blockchain fields migration:
- `supabase/migrations/20260629_add_mou_blockchain_fields.sql`

Key blockchain-related DB fields:
- `blockchain_status`
- `transaction_hash`
- `transaction_url`
- `registry_address`
- `proof_key`
- `anchored_at`
- `chain_id`
- `network_name`
- `route_hash`
- `subject_hash`
- `anchor_error`

Signature images are uploaded to:
- Supabase Storage bucket from `SUPABASE_STORAGE_BUCKET`
- path pattern:
  - `global_deal/...`
  - `creator/...`

## Frontend Files

Main page components:
- `components/pages/home-page.tsx`
- `components/pages/global-deal-page.tsx`
- `components/pages/creator-opportunity-page.tsx`
- `components/pages/about-page.tsx`

Shared blockchain token UI:
- `components/mou-blockchain-summary.tsx`

Header and footer:
- `components/site-header.tsx`
- `components/site-footer.tsx`

Data source:
- `lib/make-site-data.ts`

## Environment Variables

Required site/backend env:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY`
- `SUPABASE_STORAGE_BUCKET`

Optional email env:
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_EMAIL`

Current blockchain env:
- `BLOCKCHAIN_RPC_URL`
- `BLOCKCHAIN_PRIVATE_KEY`
- `BLOCKCHAIN_OWNER_ADDRESS`
- `BLOCKCHAIN_NETWORK_NAME`
- `BLOCKCHAIN_CONFIRMATIONS`
- `BLOCKCHAIN_EXPLORER_TX_BASE_URL`
- `MOU_REGISTRY_ADDRESS`

Important:
- `.env.local` is local only and must not be committed
- Vercel must have matching production env values configured separately

## Local Commands

Install:
```bash
pnpm install
```

Run dev server:
```bash
pnpm dev
```

Build:
```bash
pnpm build
```

Lint:
```bash
pnpm lint
```

Compile contract:
```bash
pnpm compile:contracts
```

Deploy registry:
```bash
pnpm deploy:registry
```

## Deployment Notes

Current framework:
- Next.js app router

Vercel:
- GitHub-connected deployment is in use
- local code changes do not affect Vercel until committed and pushed
- environment variables must be added in Vercel separately from `.env.local`

Current production deployment should use:
- the `main` branch
- the pushed blockchain commit

## Known Notes

- the current blockchain integration uses Polygon Amoy, not Polygon mainnet
- the current on-chain model is registry-style proof anchoring, not token minting
- free RPC providers may timeout during deployment or issuance
- if Amoy RPC becomes unstable, replace it with a dedicated Alchemy or QuickNode endpoint
- `reference/make-design/` is kept for design reference and is excluded from lint noise
- `artifacts/` is generated locally and not required for runtime

## Recommended Next Steps

Short-term:
1. verify production end-to-end issuance once more on Vercel
2. test both `/global-deal` and `/creator` issuance flows in production
3. optionally verify the contract on Polygonscan for easier read/write inspection

Product decisions still open:
1. stay on registry-style proof anchoring
2. or later move to NFT/SBT-style minting
3. decide whether to remain on Amoy for testing or deploy a new registry on Polygon mainnet

Operational next steps:
1. stabilize RPC provider if needed
2. enable Resend email delivery again when domain/email setup is ready
3. decide whether to add contract verification and revoke/admin tooling

## Handoff Summary

If continuing in a new chat, the important context is:
- the legacy Hitpick codebase has already been replaced
- the current site is the Figma Make-based 4-page rebuild
- MOU issuance is already working server-side with Supabase
- Polygon Amoy registry deployment is complete
- contract address is `0x10212Ec28FfAb4d92fbB790952b08AeaD7bC7050`
- blockchain anchoring UI has been added to issued-token screens
- latest blockchain code was committed and pushed to `main`
- Vercel production should now be using that pushed code
