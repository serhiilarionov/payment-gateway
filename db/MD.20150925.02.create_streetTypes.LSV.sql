DROP SEQUENCE IF EXISTS street_types_id_seq CASCADE;
CREATE SEQUENCE street_types_id_seq
  INCREMENT 1
  START 0
  MINVALUE 0;

DROP TABLE IF EXISTS street_types;
  CREATE TABLE street_types
(
  id integer NOT NULL DEFAULT nextval('street_types_id_seq'::regclass),
  "nameRus" character varying NOT NULL,
  "nameUk" character varying NOT NULL,
  CONSTRAINT street_types_id_pkey PRIMARY KEY (id)
);
DROP INDEX IF EXISTS fki_street_types_id;
CREATE INDEX "fki_street_types_id" ON street_types("id");
