/*
  Warnings:

  - The primary key for the `authentication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `auth_id` was added to the `authentication` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "authentication" DROP CONSTRAINT "authentication_pkey",
ADD COLUMN     "auth_id" TEXT NOT NULL,
ADD CONSTRAINT "authentication_pkey" PRIMARY KEY ("auth_id");
