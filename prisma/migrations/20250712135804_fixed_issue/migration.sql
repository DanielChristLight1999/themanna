/*
  Warnings:

  - A unique constraint covering the columns `[productId,date]` on the table `FoodOfTheDay` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FoodOfTheDay" ALTER COLUMN "date" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "FoodOfTheDay_productId_date_key" ON "FoodOfTheDay"("productId", "date");
