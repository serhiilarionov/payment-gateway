DROP INDEX IF EXISTS payments_min_year_index;
DROP INDEX IF EXISTS payments_payments_index;
DROP INDEX IF EXISTS payments_select_duplicate_index;
CREATE INDEX payments_select_duplicate_index
ON payments ("idHouse", "personalAccount", "companyId", "serviceId", mfo, "paymentDate", "dateOfEnrollment");
CREATE INDEX payments_payments_index ON payments ("idHouse", EXTRACT(YEAR FROM DATE ("paymentDate")), EXTRACT(MONTH FROM DATE ("paymentDate")));
CREATE INDEX payments_min_year_index ON payments (EXTRACT(YEAR FROM DATE ("paymentDate")));