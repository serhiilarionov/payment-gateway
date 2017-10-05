ALTER TABLE payments ALTER COLUMN "mfoRecipient" DROP NOT NULL;
ALTER TABLE payments ALTER COLUMN "recipientBankAccount" DROP NOT NULL;
ALTER TABLE payments ALTER COLUMN "transactionId" DROP NOT NULL;