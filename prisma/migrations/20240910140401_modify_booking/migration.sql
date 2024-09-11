/*
  Warnings:

  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order_id` on the `order` table. All the data in the column will be lost.
  - The required column `booking_id` was added to the `order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "order" DROP CONSTRAINT "order_pkey",
DROP COLUMN "order_id",
ADD COLUMN     "booking_id" TEXT NOT NULL,
ADD CONSTRAINT "order_pkey" PRIMARY KEY ("booking_id");
