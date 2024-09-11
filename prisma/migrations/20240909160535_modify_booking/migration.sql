/*
  Warnings:

  - Made the column `email_order` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_order` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "order" ALTER COLUMN "email_order" SET NOT NULL,
ALTER COLUMN "phone_order" SET NOT NULL;
