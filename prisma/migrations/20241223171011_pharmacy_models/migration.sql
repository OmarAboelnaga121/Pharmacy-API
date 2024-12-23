/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER', 'CUSTOMER_SUPPORT', 'PHARMACIST');

-- AlterTable
ALTER TABLE "Medicines" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';
