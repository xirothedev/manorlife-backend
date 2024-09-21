/*
  Warnings:

  - You are about to drop the `_BranchToSurroundingArea` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `branch_id` to the `SurroundingArea` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BranchToSurroundingArea" DROP CONSTRAINT "_BranchToSurroundingArea_A_fkey";

-- DropForeignKey
ALTER TABLE "_BranchToSurroundingArea" DROP CONSTRAINT "_BranchToSurroundingArea_B_fkey";

-- AlterTable
ALTER TABLE "SurroundingArea" ADD COLUMN     "branch_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_BranchToSurroundingArea";

-- AddForeignKey
ALTER TABLE "SurroundingArea" ADD CONSTRAINT "SurroundingArea_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;
