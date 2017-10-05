CREATE SEQUENCE pin_codes_id_seq
  INCREMENT 1
  START 0
  MINVALUE 0;

  CREATE TABLE pin_codes
(
  id integer NOT NULL DEFAULT nextval('pin_codes_id_seq'::regclass),
  "idHouse" character varying NOT NULL UNIQUE,
  "pinCode" integer not null,
  CONSTRAINT pin_codes_id_pkey PRIMARY KEY (id)
);

CREATE INDEX "fki_pin_codes_idHouse" ON pin_codes("idHouse");
CREATE INDEX "fki_pin_codes_pinCode" ON pin_codes("pinCode");
CREATE INDEX "fki_pin_codes_id" ON pin_codes("id");