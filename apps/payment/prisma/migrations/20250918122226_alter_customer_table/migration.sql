/*
  Warnings:

  - You are about to drop the column `email` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."customer_email_key";

-- AlterTable
ALTER TABLE "public"."customer" DROP COLUMN "email",
DROP COLUMN "name";
