CREATE TABLE IF NOT EXISTS public.metro_stations
(
    id integer NOT NULL DEFAULT nextval('metro_stations_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default",
    capacity integer,
    current_load integer,
    latitude double precision,
    longitude double precision,
    line character varying(255)[] COLLATE pg_catalog."default",
    "lineColor" character varying(16)[] COLLATE pg_catalog."default",
    CONSTRAINT metro_stations_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.metro_stations
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.roads
(
    id integer NOT NULL DEFAULT nextval('roads_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default",
    capacity integer,
    current_load integer,
    latitude double precision,
    longitude double precision,
    direction real,
    CONSTRAINT roads_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roads
    OWNER to postgres;