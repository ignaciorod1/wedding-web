-- Wedding Guests Table
-- You will manually add guests to this table via the Supabase dashboard
-- Each guest has a unique invitation code they use to log in

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  plus_one_allowed boolean default false,
  created_at timestamp with time zone default now()
);

-- RSVP Responses Table
-- Stores guest responses when they confirm or decline attendance

create table if not exists public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  guest_name text not null,
  attending boolean not null,
  plus_one_name text,
  dietary_restrictions text,
  message text,
  needs_bus boolean default false,
  bus_pickup_location text,
  bus_dropoff_location text,
  responded_at timestamp with time zone default now(),
  unique(guest_id)
);

-- Wedding Details Table (single row for your wedding info)
create table if not exists public.wedding_details (
  id uuid primary key default gen_random_uuid(),
  couple_names text not null default 'Sarah & Michael',
  wedding_date text not null default 'June 15, 2025',
  ceremony_time text not null default '4:00 PM',
  ceremony_venue text not null default 'St. Mary''s Chapel',
  ceremony_address text not null default '123 Wedding Lane, Beverly Hills, CA 90210',
  reception_time text not null default '6:00 PM',
  reception_venue text not null default 'The Grand Ballroom',
  reception_address text not null default '456 Celebration Ave, Beverly Hills, CA 90210',
  dress_code text not null default 'Black Tie Optional',
  bus_pickup_schedule text not null default '3:00 PM - Pick up from downtown',
  bus_dropoff_schedule text not null default '11:00 PM - Return to downtown'
);

-- Insert default wedding details (you can update this in the Supabase dashboard)
insert into public.wedding_details (couple_names, wedding_date) 
values ('Sarah & Michael', 'June 15, 2025')
on conflict do nothing;

-- Enable Row Level Security
alter table public.guests enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.wedding_details enable row level security;

-- Policies: Allow public read access (guests need to verify their code)
create policy "Allow public to read guests for login" on public.guests
  for select using (true);

-- Policies: Allow guests to insert/update their own RSVP
create policy "Allow public to read rsvp_responses" on public.rsvp_responses
  for select using (true);

create policy "Allow public to insert rsvp_responses" on public.rsvp_responses
  for insert with check (true);

create policy "Allow public to update rsvp_responses" on public.rsvp_responses
  for update using (true);

-- Policies: Allow public to read wedding details
create policy "Allow public to read wedding_details" on public.wedding_details
  for select using (true);

-- Insert some example guests (you can delete these and add your own)
insert into public.guests (name, code, plus_one_allowed) values
  ('John Smith', 'JOHN2025', true),
  ('Sarah Johnson', 'SARAH2025', true),
  ('Mike Williams', 'MIKE2025', false),
  ('Emily Brown', 'EMILY2025', true),
  ('David Miller', 'DAVID2025', false)
on conflict (code) do nothing;
