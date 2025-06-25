/*
  Warnings:

  - Added the required column `accountName` to the `CommissionPayoutLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `CommissionPayoutLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `CommissionPayoutLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommissionPayoutLog" ADD COLUMN     "accountName" TEXT NOT NULL,
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL;
