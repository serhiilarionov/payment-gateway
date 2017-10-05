CREATE SEQUENCE payments_id_seq
INCREMENT 1
START 0
MINVALUE 0;
CREATE TABLE payments
(
  id integer NOT NULL UNIQUE DEFAULT nextval('payments_id_seq'::regclass),
  "idHouse" character varying NOT NULL,
  "personalAccount" character varying NOT NULL,
  "recipientBankAccount" character varying NOT NULL,
  "senderBankAccount" character varying NOT NULL,
  "transactionId" character varying NOT NULL,
  "serviceId" INTEGER NOT NULL,
  "mfoSender" INTEGER NOT NULL,
  "mfoRecipient" INTEGER NOT NULL,
  "amount" NUMERIC(8,4) NOT NULL,
  "companyId" INTEGER NOT NULL,
  "paymentDate" DATE NOT NULL,
  "dateOfEnrollment" DATE NOT NULL,
  CONSTRAINT payments_id_pkey PRIMARY KEY (id),
  CONSTRAINT "payments_services_fkey" FOREIGN KEY ("serviceId") REFERENCES services (id),
  CONSTRAINT "payments_companies_fkey" FOREIGN KEY ("companyId") REFERENCES companies (id),
  CONSTRAINT "payment_mfoSender_banks_fkey" FOREIGN KEY ("mfoSender") REFERENCES banks (mfo),
  CONSTRAINT "payments_mfo_recipient_fkey" FOREIGN KEY ("mfoRecipient") REFERENCES banks (mfo)
);