DROP SEQUENCE IF EXISTS counters_id_seq CASCADE;
CREATE SEQUENCE counters_id_seq
INCREMENT 1
START 0
MINVALUE 0;

DROP TABLE IF EXISTS counters;
CREATE TABLE "counters" (
  id INTEGER NOT NULL UNIQUE DEFAULT nextval('counters_id_seq'::regclass),
  "personalAccountId" INTEGER NOT NULL,
  "idHouse" character varying NOT NULL,
  "companyId" INTEGER NOT NULL,
  "serviceId" INTEGER NOT NULL,
  position CHARACTER VARYING NULL DEFAULT NULL,
  "meterReading" NUMERIC,
  date timestamp NOT NULL DEFAULT NOW(),

  CONSTRAINT "counters_id_pkey" PRIMARY KEY (id)
);

DROP INDEX IF EXISTS counters_id_index;
CREATE INDEX counters_id_index
ON counters("id");

DROP INDEX IF EXISTS counters_index;
CREATE INDEX counters_index
ON counters("personalAccountId", "companyId", "serviceId", EXTRACT(YEAR FROM DATE ("date")), EXTRACT(MONTH FROM DATE ("date")));