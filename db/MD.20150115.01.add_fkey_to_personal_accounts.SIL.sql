ALTER TABLE personal_accounts ADD CONSTRAINT "company_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES companies (id)
ON UPDATE cascade ON DELETE restrict;