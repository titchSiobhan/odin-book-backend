/*
  Warnings:

  - You are about to drop the column `invitation` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `isFriend` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `status` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "likes" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "invitation",
DROP COLUMN "isBlocked",
DROP COLUMN "isFriend",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ALTER COLUMN "likes" SET DEFAULT 0;
