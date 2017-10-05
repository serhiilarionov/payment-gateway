ALTER TABLE personal_accounts
ADD COLUMN "debt" NUMERIC(8,4) NOT NULL DEFAULT 0,
ADD COLUMN "accrual" NUMERIC(8,4) NOT NULL DEFAULT 0,
ADD COLUMN "forPayment" NUMERIC(8,4) NOT NULL DEFAULT 0,
ADD COLUMN "paid" NUMERIC(8,4) NOT NULL DEFAULT 0,
ADD COLUMN "serviceId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "dateOfAccrued" DATE NOT NULL DEFAULT now();
