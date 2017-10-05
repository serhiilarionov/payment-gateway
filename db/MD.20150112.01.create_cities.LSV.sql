CREATE SEQUENCE cities_id_seq
  INCREMENT 1
  START 0
  MINVALUE 0;

  CREATE TABLE cities
(
  id integer NOT NULL DEFAULT nextval('cities_id_seq'::regclass),
  "nameRus" character varying NOT NULL,
  "nameUk" character varying NOT NULL,
  CONSTRAINT cities_id_pkey PRIMARY KEY (id)
);
CREATE INDEX "fki_cities_id" ON cities("id");
