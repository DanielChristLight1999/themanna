/*
  Warnings:

  - The values [PAYSTACK] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CARD', 'CASH', 'TRANSFER');
ALTER TABLE "Payment" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
ALTER TABLE "Payment" ALTER COLUMN "method" SET DEFAULT 'CARD';
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "method" SET DEFAULT 'CARD';
