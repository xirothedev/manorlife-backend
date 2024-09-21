/*
  Warnings:

  - You are about to drop the column `trademark` on the `Room` table. All the data in the column will be lost.
  - Added the required column `trademark` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "trademark" "TradeMark" NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "trademark";
