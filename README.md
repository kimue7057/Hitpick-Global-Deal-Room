# Hitpick Global Deal Platform

Hitpick Global Deal Platform with:
- Home
- Global Deal
- Creator
- About
- MOU issuance API
- Supabase signature storage and submission records
- Optional blockchain anchoring for issued proofs

## Blockchain quick start

1. Compile the smart contract:
   - `pnpm compile:contracts`
2. Set blockchain env values in `.env.local`:
   - `BLOCKCHAIN_RPC_URL`
   - `BLOCKCHAIN_PRIVATE_KEY`
   - `BLOCKCHAIN_OWNER_ADDRESS` (optional)
   - `BLOCKCHAIN_NETWORK_NAME` (optional)
   - `BLOCKCHAIN_EXPLORER_TX_BASE_URL` (optional)
3. Deploy the registry:
   - `pnpm deploy:registry`
4. Copy the deployed contract address into:
   - `MOU_REGISTRY_ADDRESS`

When blockchain env values are present, `POST /api/mou/issue` stores the MOU in Supabase first and then anchors the proof on-chain.
