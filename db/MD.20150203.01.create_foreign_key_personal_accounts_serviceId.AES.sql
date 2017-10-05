ALTER TABLE personal_accounts
ADD FOREIGN KEY ("serviceId") REFERENCES services(id);