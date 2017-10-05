ALTER TABLE employees DROP COLUMN "password";
ALTER TABLE employees ADD COLUMN "expirationDate" DATE DEFAULT NULL;