DROP SEQUENCE IF EXISTS payment_document_id_seq CASCADE;
CREATE SEQUENCE payment_document_id_seq
INCREMENT 1
START 0
MINVALUE 0;

DROP TABLE IF EXISTS payment_document;
CREATE TABLE "payment_document" (
  id INTEGER NOT NULL UNIQUE DEFAULT nextval('payment_document_id_seq'::regclass),
  date timestamp DEFAULT NOW(),
  sum NUMERIC,
  payer CHARACTER VARYING NOT NULL DEFAULT 'NULL',
  "idHouse" character varying NOT NULL,
  hash CHARACTER VARYING not null UNIQUE,
  CONSTRAINT "payment_document_id_pkey" PRIMARY KEY (id)
);


DROP INDEX IF EXISTS payment_document_id_index;
CREATE INDEX payment_document_id_index
ON payment_document("id");