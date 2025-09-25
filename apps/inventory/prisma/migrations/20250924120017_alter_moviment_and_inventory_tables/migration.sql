/*
  Warnings:

  - A unique constraint covering the columns `[sagaId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sagaId]` on the table `Moviment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Inventory" ADD COLUMN     "sagaId" TEXT;

-- AlterTable
ALTER TABLE "public"."Moviment" ADD COLUMN     "sagaId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sagaId_key" ON "public"."Inventory"("sagaId");

-- CreateIndex
CREATE UNIQUE INDEX "Moviment_sagaId_key" ON "public"."Moviment"("sagaId");
