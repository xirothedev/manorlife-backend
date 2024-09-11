/*
  Warnings:

  - You are about to drop the `authentication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "authentication" DROP CONSTRAINT "authentication_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_room_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropTable
DROP TABLE "authentication";

-- DropTable
DROP TABLE "order";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "Auth" (
    "user_id" TEXT NOT NULL,
    "last_sent_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "auth_type" "AuthType" NOT NULL,
    "auth_id" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("auth_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "checkin" TIMESTAMP(3) NOT NULL,
    "checkout" TIMESTAMP(3) NOT NULL,
    "fullname_order" TEXT NOT NULL,
    "fullname_customer" TEXT,
    "email_order" TEXT NOT NULL,
    "email_customer" TEXT,
    "phone_order" TEXT NOT NULL,
    "phone_customer" TEXT,
    "note" TEXT,
    "type" "BookingType" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "babies" INTEGER NOT NULL DEFAULT 0,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'VND',
    "order_code" SERIAL NOT NULL,
    "range" "BookingRange" NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "booking_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "session_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_data" TEXT,
    "ip" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "nights" INTEGER NOT NULL DEFAULT 0,
    "books" INTEGER NOT NULL DEFAULT 0,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "roles" "UserRole"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_order_code_key" ON "Booking"("order_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User" USING HASH ("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User" USING HASH ("phone");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
