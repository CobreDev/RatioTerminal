create table public.ratios
(
    "messageID" varchar                  not null
        primary key,
    "guildID"   varchar                  not null,
    accepted    boolean                  not null,
    "wasRigged" boolean                  not null,
    "rigOdds"   smallint,
    "createdOn" timestamp with time zone not null,
    "userID"    varchar                  not null
);

alter table public.ratios
    owner to supabase_admin;

grant delete, insert, references, select, trigger, truncate, update on public.ratios to postgres;