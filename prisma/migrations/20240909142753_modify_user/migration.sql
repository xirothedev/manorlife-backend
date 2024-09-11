-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('email', 'phone');

-- CreateTable
CREATE TABLE "authentication" (
    "user_id" TEXT NOT NULL,
    "last_sent_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "auth_type" "AuthType" NOT NULL,

    CONSTRAINT "authentication_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "authentication" ADD CONSTRAINT "authentication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
