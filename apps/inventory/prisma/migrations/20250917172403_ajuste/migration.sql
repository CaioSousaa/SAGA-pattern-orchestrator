/*
  Warnings:

  - You are about to drop the column `reserved` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Item` table. All the data in the column will be lost.
  - Made the column `name` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inventoryId` on table `Moviment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Moviment" DROP CONSTRAINT "Moviment_inventoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Inventory" DROP COLUMN "reserved";

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "productId",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Moviment" ALTER COLUMN "inventoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Moviment" ADD CONSTRAINT "Moviment_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "public"."Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
