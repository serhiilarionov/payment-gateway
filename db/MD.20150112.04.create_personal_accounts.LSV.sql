CREATE SEQUENCE personal_accounts_id_seq
  INCREMENT 1
  START 0
  MINVALUE 0;

  CREATE TABLE personal_accounts
(
  id integer NOT NULL DEFAULT nextval('personal_accounts_id_seq'::regclass),
  "number" character varying NOT NULL,
  "idHouse" character varying NOT NULL,
  "companyId" integer not null,
  CONSTRAINT personal_accounts_id_pkey PRIMARY KEY (id)
);
ALTER TABLE personal_accounts ADD CONSTRAINT "pin_codes_idHouse_fkey" FOREIGN KEY ("idHouse") REFERENCES pin_codes ("idHouse")
ON UPDATE cascade ON DELETE restrict;
CREATE INDEX "fki_personal_accounts_idHouse" ON personal_accounts("idHouse");
CREATE INDEX "fki_personal_accounts_id" ON personal_accounts("id");
CREATE INDEX "fki_personal_accounts_companyId" ON personal_accounts("companyId");