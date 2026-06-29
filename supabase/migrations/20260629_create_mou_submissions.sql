create extension if not exists pgcrypto;

create table if not exists public.mou_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('global_deal', 'creator')),
  proof_type text not null,
  mou_type text not null,
  token_id text not null unique,
  document_hash text not null,
  issued_at timestamptz not null,
  name text,
  company_name text,
  contact_name text,
  creator_name text,
  email text not null,
  country text,
  website text,
  sns_link text,
  main_channel text,
  market text,
  region text,
  category text,
  goal text,
  route jsonb not null default '[]'::jsonb,
  signature_url text,
  signature_hash text not null,
  status text not null default 'issued',
  email_sent boolean not null default false,
  admin_email_sent boolean not null default false,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists mou_submissions_type_idx on public.mou_submissions (type);
create index if not exists mou_submissions_token_id_idx on public.mou_submissions (token_id);
create index if not exists mou_submissions_created_at_idx on public.mou_submissions (created_at desc);
