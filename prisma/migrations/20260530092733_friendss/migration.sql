/*
  Warnings:

  - A unique constraint covering the columns `[requesterId,receiverId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Friends_receiverId_requesterId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Friends_requesterId_receiverId_key" ON "Friends"("requesterId", "receiverId");
