/*
  Warnings:

  - The `status` column on the `order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `range` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('paid', 'pending', 'cancelled');

-- CreateEnum
CREATE TYPE "BookingRange" AS ENUM ('nights', 'months');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "range" "BookingRange" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "BillStatus";
