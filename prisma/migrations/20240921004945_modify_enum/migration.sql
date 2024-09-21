-- CreateEnum
CREATE TYPE "Province" AS ENUM ('ho_chi_minh', 'ha_noi', 'da_nang');

-- CreateEnum
CREATE TYPE "Ward" AS ENUM ('quan_3', 'quan_2', 'quan_1', 'tan_binh', 'binh_thach', 'phu_nhuan', 'pho_co', 'gan_cau_rong');

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "province" "Province",
ADD COLUMN     "ward" "Ward";
