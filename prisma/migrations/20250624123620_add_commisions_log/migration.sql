-- AlterTable
ALTER TABLE "Commission" ADD COLUMN     "payoutLogId" INTEGER;

-- CreateTable
CREATE TABLE "AffiliatePayoutAccount" (
    "id" SERIAL NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliatePayoutAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionPayoutLog" (
    "id" SERIAL NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionPayoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffiliatePayoutAccount_affiliateId_key" ON "AffiliatePayoutAccount"("affiliateId");

-- AddForeignKey
ALTER TABLE "AffiliatePayoutAccount" ADD CONSTRAINT "AffiliatePayoutAccount_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_payoutLogId_fkey" FOREIGN KEY ("payoutLogId") REFERENCES "CommissionPayoutLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionPayoutLog" ADD CONSTRAINT "CommissionPayoutLog_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
