/*
  Warnings:

  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[order_code]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" "Currency" NOT NULL,
ADD COLUMN     "order_code" SERIAL NOT NULL,
ADD COLUMN     "status" "BillStatus" NOT NULL;

-- DropTable
DROP TABLE "Bill";

-- CreateIndex
CREATE UNIQUE INDEX "order_order_code_key" ON "order"("order_code");
