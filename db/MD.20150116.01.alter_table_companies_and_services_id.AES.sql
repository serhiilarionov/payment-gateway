ALTER TABLE companies
ADD COLUMN "companyId" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE services
ADD COLUMN "serviceId" INTEGER NOT NULL DEFAULT 0;