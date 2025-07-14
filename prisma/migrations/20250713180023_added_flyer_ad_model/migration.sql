-- CreateEnum
CREATE TYPE "FlyerPosition" AS ENUM ('top', 'middle', 'footer');

-- CreateTable
CREATE TABLE "FlyerAd" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "position" "FlyerPosition" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "FlyerAd_pkey" PRIMARY KEY ("id")
);
