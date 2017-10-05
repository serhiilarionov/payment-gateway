CREATE SEQUENCE verificationlinks_id_seq
INCREMENT 1
START 0
MINVALUE 0;
CREATE TABLE "verificationLinks" (
  id INTEGER NOT NULL UNIQUE DEFAULT nextval('verificationlinks_id_seq'::regclass),
  login character varying,
  link character varying,
  expiresOn DATE,
  password character varying,
  CONSTRAINT "verificationLinks_id_pkey" PRIMARY KEY (id)
);

CREATE INDEX verificationLinks_login_index ON "verificationLinks" ("login");
CREATE INDEX verificationLinks_link_index ON "verificationLinks" ("link");
CREATE INDEX verificationLinks_password_index ON "verificationLinks" ("password");