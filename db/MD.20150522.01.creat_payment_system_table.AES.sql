DROP SEQUENCE IF EXISTS public.payment_system_id_seq CASCADE;
CREATE SEQUENCE payment_system_id_seq
INCREMENT 1
START 0
MINVALUE 0;

DROP TABLE IF EXISTS payment_systems;
CREATE TABLE "payment_systems" (
  id INTEGER NOT NULL UNIQUE DEFAULT nextval('payment_system_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  options character varying,
  CONSTRAINT "payment_system_id_pkey" PRIMARY KEY (id)
);