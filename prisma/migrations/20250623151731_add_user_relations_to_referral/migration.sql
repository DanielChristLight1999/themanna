-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredUser_fkey" FOREIGN KEY ("referredUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
