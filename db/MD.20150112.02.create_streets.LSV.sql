CREATE SEQUENCE streets_id_seq
INCREMENT 1
START 0
MINVALUE 0;

CREATE TABLE streets
(
  id integer NOT NULL DEFAULT nextval('streets_id_seq'::regclass),
  "nameRus" character varying NOT NULL,
  "nameUk" character varying NOT NULL,
  "cityId" integer not null,
  CONSTRAINT streets_id_pkey PRIMARY KEY (id)
);

ALTER TABLE streets ADD CONSTRAINT "cities_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES cities (id)
ON UPDATE cascade ON DELETE restrict;
CREATE INDEX "fki_streets_cityId" ON streets("cityId");
CREATE INDEX "fki_streets_id" ON streets("id");
