const Pool = require('pg-pool');

const pool = new Pool({
    user: "qablit79_user",
    password: "kPp7GjQFEJLEff1qPXuwOp4BwKPzkUmu",
    host: "dpg-crg5qcjv2p9s73a8f8vg-a.oregon-postgres.render.com",
    port: 5432,
    database: "qablit79",
    ssl: { rejectUnauthorized: false } 
})
//CREATE SEQUENCE IF NOT EXISTS public.c_table_id_seq;
//DROP TABLE metro;
//DROP SEQUENCE metro_id_seq;
pool.query(`

    CREATE SEQUENCE IF NOT EXISTS public.metro_id_seq;

    CREATE TABLE IF NOT EXISTS public.metro
(
    id integer NOT NULL DEFAULT nextval('metro_id_seq'::regclass),
    line_id integer NOT NULL,
    name_line character varying(127)[] COLLATE pg_catalog."default",
    color_line character varying(15)[] COLLATE pg_catalog."default",
    "limit" integer DEFAULT 16000,
    flow integer DEFAULT 7000,
    latitude real NOT NULL,
    longitude real NOT NULL,
    name character varying(127)[] COMPRESSION pglz COLLATE pg_catalog."default",
    CONSTRAINT metro_pkey PRIMARY KEY (id, line_id)
)

TABLESPACE pg_default;

`, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Таблица metro создана!');
});

module.exports = pool