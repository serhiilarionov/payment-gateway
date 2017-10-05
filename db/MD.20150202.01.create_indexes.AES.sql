DROP INDEX IF EXISTS banks_mfo_index;
DROP INDEX IF EXISTS cities_id_index;
DROP INDEX IF EXISTS companies_cityId_index;
DROP INDEX IF EXISTS companies_id_index;
DROP INDEX IF EXISTS companies_companyId_companyName_index;
DROP INDEX IF EXISTS employees_id_index;
DROP INDEX IF EXISTS employees_login_index;
DROP INDEX IF EXISTS payments_id_index;
DROP INDEX IF EXISTS payments_serviceId_index;
DROP INDEX IF EXISTS payments_mfoSender_index;
DROP INDEX IF EXISTS payments_mfoRecipient_index;
DROP INDEX IF EXISTS payments_companyId_index;
DROP INDEX IF EXISTS personal_accounts_id_index;
DROP INDEX IF EXISTS personal_accounts_companyId_index;
DROP INDEX IF EXISTS services_id_index;
DROP INDEX IF EXISTS streets_id_index;

CREATE INDEX banks_mfo_index
ON banks("mfo");
CREATE INDEX cities_id_index
ON cities("id");
CREATE INDEX companies_id_index
ON companies("id");
CREATE INDEX companies_companyId_companyName_index
ON companies("companyId", "companyName");
CREATE INDEX companies_cityId_index
ON companies("cityId");
CREATE INDEX employees_login_index
ON employees("login");
CREATE INDEX payments_id_index
ON payments("id");
CREATE INDEX payments_serviceId_index
ON payments("serviceId");
CREATE INDEX payments_mfoSender_index
ON payments("mfoSender");
CREATE INDEX payments_mfoRecipient_index
ON payments("mfoRecipient");
CREATE INDEX payments_companyId_index
ON payments("companyId");
CREATE INDEX personal_accounts_id_index
ON personal_accounts("id");
CREATE INDEX personal_accounts_companyId_index
ON personal_accounts("companyId");
CREATE INDEX streets_id_index
ON streets("id");