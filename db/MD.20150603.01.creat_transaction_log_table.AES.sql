DROP SEQUENCE IF EXISTS transaction_log_id_seq CASCADE;
CREATE SEQUENCE transaction_log_id_seq
INCREMENT 1
START 0
MINVALUE 0;

DROP TABLE IF EXISTS transaction_log;
CREATE TABLE "transaction_log" (
  id INTEGER NOT NULL UNIQUE DEFAULT nextval('transaction_log_id_seq'::regclass),
  "paymentDocumentId" INTEGER NOT NULL,
  date timestamp DEFAULT NOW(),
  accrual NUMERIC,
  hash CHARACTER VARYING,
  "receiptOfThePaymentSystem" CHARACTER VARYING,
  "senderName" CHARACTER VARYING,
  "senderEdrpoy"  INTEGER,
  "senderMfo"  INTEGER,
  "senderBankAccount"  CHARACTER VARYING,
  "recipientName" CHARACTER VARYING,
  "recipientEdrpoy" INTEGER,
  "recipientMfo" INTEGER,
  "recipientBankAccount" CHARACTER VARYING,
  status CHARACTER VARYING,
  CONSTRAINT "transaction_log_id_pkey" PRIMARY KEY (id)
);


DROP INDEX IF EXISTS transaction_log_id_index;
CREATE INDEX transaction_log_id_index
ON transaction_log("id");
DROP INDEX IF EXISTS transaction_log_date_index;
CREATE INDEX transaction_log_date_index ON transaction_log (DATE("date"));