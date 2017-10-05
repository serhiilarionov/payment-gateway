DROP SEQUENCE IF EXISTS payments_payment_document_id_seq CASCADE;
CREATE SEQUENCE payments_payment_document_id_seq
INCREMENT 1
START 0
MINVALUE 0;

DROP TABLE IF EXISTS payments_payment_document;
CREATE TABLE "payments_payment_document" (
  id INTEGER NOT NULL UNIQUE DEFAULT nextval('payments_payment_document_id_seq'::regclass),
  "idHouse" character varying NOT NULL,
  "personalAccountId" INTEGER NOT NULL,
  "companyId" INTEGER NOT NULL,
  "serviceId" INTEGER NOT NULL,
  date timestamp DEFAULT NOW(),
  sum NUMERIC,
  CONSTRAINT "payments_payment_document_id_pkey" PRIMARY KEY (id)
);

DROP INDEX IF EXISTS payments_payment_document_id_index;
CREATE INDEX payments_payment_document_id_index
ON payments_payment_document("id");