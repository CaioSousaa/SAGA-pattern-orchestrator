/*
  Warnings:

  - You are about to drop the column `reference_number` on the `product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."product_reference_number_key";

-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "reference_number";
