CREATE SEQUENCE employees_id_seq
  INCREMENT 1
  START 0
  MINVALUE 0;

CREATE TABLE employees
(
  id integer NOT NULL DEFAULT nextval('employees_id_seq'::regclass),
  "login" character varying NOT NULL,
  "fio" character varying NOT NULL,
  "password" character varying NOT NULL,
  "cityId" integer NOT NULL,
  "companyId" integer NOT NULL,
  "roleId" integer NOT NULL,
  CONSTRAINT employees_id_pkey PRIMARY KEY (id),
  CONSTRAINT "cities_citiesId_fkey" FOREIGN KEY ("cityId") REFERENCES cities(id)
  ON UPDATE cascade ON DELETE restrict,
  CONSTRAINT "companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES companies(id)
  ON UPDATE cascade ON DELETE restrict,
  CONSTRAINT "roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES roles(id)
  ON UPDATE cascade ON DELETE restrict
);

ALTER TABLE employees
ADD "email" character varying NOT NULL;