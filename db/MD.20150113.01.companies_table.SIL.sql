CREATE SEQUENCE companies_id_seq
  INCREMENT 1
  START 0
  MINVALUE 0;

  CREATE TABLE companies
(
  id integer NOT NULL DEFAULT nextval('companies_id_seq'::regclass),
  "cityId" integer NOT NULL,
  "companyName" character varying NOT NULL,
  CONSTRAINT companies_id_pkey PRIMARY KEY (id),
  CONSTRAINT "cities_citiesId_fkey" FOREIGN KEY ("cityId") REFERENCES cities(id)
	ON UPDATE cascade ON DELETE restrict
);