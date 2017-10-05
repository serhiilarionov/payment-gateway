CREATE SEQUENCE roles_id_seq
  INCREMENT 1
  START 0
  MINVALUE 0;

  CREATE TABLE roles
(
  id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  "roleNameRus" character varying NOT NULL,
  "roleNameUk" character varying NOT NULL,
  CONSTRAINT roles_id_pkey PRIMARY KEY (id)
);