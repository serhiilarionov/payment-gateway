ALTER TABLE companies
ALTER COLUMN "companyId" TYPE character varying USING "companyId"::character varying;