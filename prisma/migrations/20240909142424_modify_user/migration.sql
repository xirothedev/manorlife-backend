/*
  Warnings:

  - You are about to drop the column `display_name` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_display_name_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "display_name";
