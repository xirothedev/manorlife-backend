-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('administrator', 'platinum', 'gold', 'silver', 'new');

-- CreateEnum
CREATE TYPE "Comport" AS ENUM ('free_laundry_room', 'HCM_center', 'HN_center', 'cleaning_services', 'suitable_for_1_2_people', 'high_speed_wifi', 'area_from_20m2_32m2', 'city_view', 'river_view', 'balcony', 'desk_working', 'utility_kitchen', 'microwave_oven', 'private_bathroom', 'minibar_refrigerator', 'security_247', 'gym', 'comfortable_room', 'breakfast_buffet', 'pool', 'civilized_community', 'free_laundry', 'television', 'beauty_scene', 'airport_support');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('available', 'almost_full', 'full');

-- CreateEnum
CREATE TYPE "TradeMark" AS ENUM ('signature_by_m_village', 'my_village_living', 'm_village_hotel', 'express_by_m_village');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('my_set', 'help_set');

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "nights" INTEGER NOT NULL DEFAULT 0,
    "books" INTEGER NOT NULL DEFAULT 0,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "roles" "UserRole"[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "session" (
    "session_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_data" TEXT,
    "ip" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "baby" INTEGER NOT NULL DEFAULT 0,
    "checkin" TIMESTAMP(3) NOT NULL,
    "checkout" TIMESTAMP(3) NOT NULL,
    "fullname_order" TEXT NOT NULL,
    "fullname_customer" TEXT,
    "email_order" TEXT,
    "email_customer" TEXT,
    "phone_order" TEXT,
    "phone_customer" TEXT,
    "note" TEXT,
    "type" "BookingType" NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "room_id" TEXT NOT NULL,
    "price_per_night" INTEGER NOT NULL,
    "price_per_month" INTEGER NOT NULL,
    "trademark" "TradeMark" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "comforts" "Comport"[],
    "location" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'available',
    "images" TEXT[],

    CONSTRAINT "Room_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "SurroundingArea" (
    "area_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distance" TEXT NOT NULL,

    CONSTRAINT "SurroundingArea_pkey" PRIMARY KEY ("area_id")
);

-- CreateTable
CREATE TABLE "_RoomToSurroundingArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_display_name_idx" ON "user"("display_name");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user" USING HASH ("email");

-- CreateIndex
CREATE INDEX "user_phone_idx" ON "user" USING HASH ("phone");

-- CreateIndex
CREATE UNIQUE INDEX "_RoomToSurroundingArea_AB_unique" ON "_RoomToSurroundingArea"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomToSurroundingArea_B_index" ON "_RoomToSurroundingArea"("B");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToSurroundingArea" ADD CONSTRAINT "_RoomToSurroundingArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToSurroundingArea" ADD CONSTRAINT "_RoomToSurroundingArea_B_fkey" FOREIGN KEY ("B") REFERENCES "SurroundingArea"("area_id") ON DELETE CASCADE ON UPDATE CASCADE;
