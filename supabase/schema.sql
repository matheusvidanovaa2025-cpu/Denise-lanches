create extension if not exists pgcrypto;

create table if not exists public.store_settings (
 id uuid primary key default gen_random_uuid(), name text not null default 'Denise Lanches',
 logo_url text, phone text, address text, delivery_fee numeric(10,2) default 0,
 is_open boolean default true, created_at timestamptz default now()
);
create table if not exists public.categories (
 id uuid primary key default gen_random_uuid(), name text not null,
 icon text default 'grid', sort_order int default 0, active boolean default true
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete set null,
 name text not null, description text default '', price numeric(10,2) not null default 0,
 image_url text, icon text default '🍔', active boolean default true,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), customer_name text not null, phone text not null,
 address text not null, notes text, payment_method text not null, total numeric(10,2) not null default 0,
 status text not null default 'received', payment_status text not null default 'pending',
 created_at timestamptz default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null, quantity int not null default 1,
 unit_price numeric(10,2) not null default 0
);
create table if not exists public.support_threads (
 id uuid primary key default gen_random_uuid(), customer_name text, customer_phone text,
 status text default 'open', created_at timestamptz default now()
);
create table if not exists public.support_messages (
 id uuid primary key default gen_random_uuid(), thread_id uuid not null references public.support_threads(id) on delete cascade,
 sender_type text not null default 'customer', message text not null, created_at timestamptz default now()
);

alter table public.store_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.support_threads enable row level security;
alter table public.support_messages enable row level security;

drop policy if exists "public read settings" on public.store_settings;
create policy "public read settings" on public.store_settings for select to anon,authenticated using (true);
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select to anon,authenticated using (active=true);
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select to anon,authenticated using (active=true);
drop policy if exists "public insert orders" on public.orders;
create policy "public insert orders" on public.orders for insert to anon,authenticated with check (true);
drop policy if exists "public insert order items" on public.order_items;
create policy "public insert order items" on public.order_items for insert to anon,authenticated with check (true);
drop policy if exists "public insert threads" on public.support_threads;
create policy "public insert threads" on public.support_threads for insert to anon,authenticated with check (true);
drop policy if exists "public insert messages" on public.support_messages;
create policy "public insert messages" on public.support_messages for insert to anon,authenticated with check (true);

insert into public.categories(name,icon,sort_order)
select x.name,x.icon,x.sort_order from (values
('Lanches','burger',1),('Porções','fries',2),('Bebidas','drink',3),('Sobremesas','cake',4),('Combos','combo',5)
) x(name,icon,sort_order)
where not exists (select 1 from public.categories c where lower(c.name)=lower(x.name));