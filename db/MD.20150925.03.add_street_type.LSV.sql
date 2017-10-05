ALTER TABLE streets ADD "streetType" INT;
ALTER TABLE streets ADD CONSTRAINT "streets_streetType_fkey" FOREIGN KEY ("streetType") REFERENCES street_types (id)
ON UPDATE cascade ON DELETE restrict;