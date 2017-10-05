ALTER TABLE payments_payment_document
      ADD COLUMN "paymentDocumentId" INTEGER,
      ADD COLUMN "endDate" DATE,
      ADD COLUMN "startDate" DATE,
      ADD CONSTRAINT "payments_payment_document_fkey" FOREIGN KEY ("paymentDocumentId") REFERENCES payment_document (id);