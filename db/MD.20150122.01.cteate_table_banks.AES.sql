CREATE TABLE banks
(
  mfo integer UNIQUE NOT NULL,
  "name" character varying NOT NULL,
  CONSTRAINT banks_mfo_pkey PRIMARY KEY (mfo)
);

