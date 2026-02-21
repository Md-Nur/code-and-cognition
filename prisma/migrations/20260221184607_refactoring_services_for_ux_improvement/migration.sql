/*
  Warnings:

  - You are about to drop the column `engagementModelId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[proposalId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_engagementModelId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "engagementModelId",
ADD COLUMN     "discovery" JSONB,
ADD COLUMN     "proposalId" TEXT;

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "milestones" TEXT[],
ADD COLUMN     "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_proposalId_key" ON "Booking"("proposalId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
