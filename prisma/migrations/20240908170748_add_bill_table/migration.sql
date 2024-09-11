-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('paid', 'pending', 'cancelled');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('VND', 'USD');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Bill" (
    "bill_id" TEXT NOT NULL,
    "order_code" SERIAL NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BillStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("bill_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_order_code_key" ON "Bill"("order_code");
