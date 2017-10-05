DROP INDEX IF EXISTS personal_accounts_select_duplicate_index;
DROP INDEX IF EXISTS companies_select_company_index;
DROP INDEX IF EXISTS services_select_service_index;

CREATE INDEX companies_select_company_index
ON companies ("companyName", "companyId");
CREATE INDEX services_select_service_index
ON services ("serviceName", "serviceId");
CREATE INDEX personal_accounts_select_duplicate_index
ON personal_accounts (number, "idHouse", "companyId", "dateOfAccrued", "serviceId");