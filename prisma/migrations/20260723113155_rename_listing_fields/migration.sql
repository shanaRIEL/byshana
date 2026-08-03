/*
  Warnings:

  - You are about to drop the column `buyPrice` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `dailyRate` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalPricePerDay` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'PAUSED', 'SOLD');

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_userId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "buyPrice",
DROP COLUMN "dailyRate",
DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION,
ADD COLUMN     "rentalPricePerDay" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
