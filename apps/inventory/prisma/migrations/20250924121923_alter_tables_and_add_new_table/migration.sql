/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Moviment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Moviment" DROP CONSTRAINT "Moviment_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Moviment" DROP CONSTRAINT "Moviment_itemId_fkey";

-- DropTable
DROP TABLE "public"."Inventory";

-- DropTable
DROP TABLE "public"."Item";

-- DropTable
DROP TABLE "public"."Moviment";

-- CreateTable
CREATE TABLE "public"."inventory" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."moviment" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" "public"."MovimentType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "moviment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_transaction_history" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "sagaId" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "typeMoviment" "public"."MovimentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transaction_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_itemId_key" ON "public"."inventory"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transaction_history_itemId_key" ON "public"."inventory_transaction_history"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transaction_history_inventoryId_key" ON "public"."inventory_transaction_history"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transaction_history_sagaId_key" ON "public"."inventory_transaction_history"("sagaId");

-- AddForeignKey
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."moviment" ADD CONSTRAINT "moviment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."moviment" ADD CONSTRAINT "moviment_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
