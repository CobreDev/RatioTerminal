create table public.users
(
    "userID"      varchar                    not null
        primary key,
    username      varchar                    not null,
    discriminator varchar                    not null,
    "wCount"      bigint default '0'::bigint not null,
    "lCount"      bigint default '0'::bigint not null,
    "createdOn"   timestamp with time zone   not null,
    "updatedOn"   timestamp with time zone
);

alter table public.users
    owner to supabase_admin;

grant delete, insert, references, select, trigger, truncate, update on public.users to postgres;