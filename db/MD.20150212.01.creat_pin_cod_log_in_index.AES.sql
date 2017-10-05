DROP INDEX IF EXISTS pin_codes_log_in_index;

CREATE INDEX pin_codes_log_in_index
ON pin_codes("isDeleted", "idHouse", "pinCode" );