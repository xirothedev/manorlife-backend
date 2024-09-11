/*
  Warnings:

  - You are about to drop the column `baby` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "baby",
ADD COLUMN     "babies" INTEGER NOT NULL DEFAULT 0;
