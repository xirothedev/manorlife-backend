/*
  Warnings:

  - You are about to drop the column `user_id` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_user_id_fkey";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles";

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
