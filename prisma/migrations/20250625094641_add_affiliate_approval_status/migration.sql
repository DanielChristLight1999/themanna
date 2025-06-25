/*
  Warnings:

  - You are about to drop the column `approved` on the `Affiliate` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AffiliateApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Affiliate" DROP COLUMN "approved",
ADD COLUMN     "status" "AffiliateApprovalStatus" NOT NULL DEFAULT 'PENDING';
