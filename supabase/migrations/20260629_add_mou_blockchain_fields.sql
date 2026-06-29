alter table public.mou_submissions
  add column if not exists anchored_at timestamptz,
  add column if not exists anchor_error text,
  add column if not exists block_number bigint,
  add column if not exists blockchain_status text not null default 'not_configured',
  add column if not exists chain_id bigint,
  add column if not exists network_name text,
  add column if not exists proof_key text,
  add column if not exists registry_address text,
  add column if not exists route_hash text,
  add column if not exists subject_hash text,
  add column if not exists transaction_hash text,
  add column if not exists transaction_url text;

create index if not exists mou_submissions_blockchain_status_idx
  on public.mou_submissions (blockchain_status);

create index if not exists mou_submissions_transaction_hash_idx
  on public.mou_submissions (transaction_hash);
