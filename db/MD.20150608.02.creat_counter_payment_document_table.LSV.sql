DROP SEQUENCE IF EXISTS counter_payment_document_id_seq CASCADE;
CREATE SEQUENCE counter_payment_document_id_seq
INCREMENT 1
START 0
MINVALUE 0;

DROP TABLE IF EXISTS counter_payment_document;
CREATE TABLE "counter_payment_document" (
  id INTEGER NOT NULL UNIQUE DEFAULT nextval('counter_payment_document_id_seq'::regclass),
  date timestamp DEFAULT NOW(),
  "idHouse" character varying NOT NULL,
  "counterId" INTEGER NOT NULL,
  "companyId" INTEGER NOT NULL,
  "serviceId" INTEGER NOT NULL,
  position CHARACTER VARYING NULL DEFAULT 'NULL',
  "meterReading" NUMERIC,
  CONSTRAINT "counter_payment_document_id_pkey" PRIMARY KEY (id)
);

DROP INDEX IF EXISTS counter_payment_document_id_index;
CREATE INDEX counter_payment_document_id_index
ON counter_payment_document("id");