CREATE SEQUENCE services_id_seq
INCREMENT 1
START 0
MINVALUE 0;

CREATE TABLE services
(
  id integer NOT NULL DEFAULT nextval('services_id_seq'::regclass),
  "serviceName" character varying NOT NULL,
  "companyId" INTEGER NOT NULL,
  CONSTRAINT services_id_pkey PRIMARY KEY (id),
  CONSTRAINT "services_companies_fkey" FOREIGN KEY ("companyId") REFERENCES companies(id)
);