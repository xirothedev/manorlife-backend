/*
  Warnings:

  - You are about to drop the column `location` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `_RoomToSurroundingArea` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `branch_id` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoomToSurroundingArea" DROP CONSTRAINT "_RoomToSurroundingArea_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToSurroundingArea" DROP CONSTRAINT "_RoomToSurroundingArea_B_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "location",
ADD COLUMN     "branch_id" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_RoomToSurroundingArea";

-- CreateTable
CREATE TABLE "Branch" (
    "branch_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "best_comforts" "Comport"[],
    "location" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "_BranchToSurroundingArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToSurroundingArea_AB_unique" ON "_BranchToSurroundingArea"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToSurroundingArea_B_index" ON "_BranchToSurroundingArea"("B");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToSurroundingArea" ADD CONSTRAINT "_BranchToSurroundingArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToSurroundingArea" ADD CONSTRAINT "_BranchToSurroundingArea_B_fkey" FOREIGN KEY ("B") REFERENCES "SurroundingArea"("area_id") ON DELETE CASCADE ON UPDATE CASCADE;
