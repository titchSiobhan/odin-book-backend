/*
  Warnings:

  - You are about to drop the column `friendId` on the `Friends` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiverId,requesterId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterId` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendId_fkey";

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "friendId",
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "requesterId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "Friends_receiverId_requesterId_key" ON "Friends"("receiverId", "requesterId");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
