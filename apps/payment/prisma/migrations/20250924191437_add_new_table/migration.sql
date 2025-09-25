/*
  Warnings:

  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."product";

-- CreateTable
CREATE TABLE "public"."customer_payment_history" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "balanceAfterPayment" INTEGER NOT NULL,
    "totalPayable" INTEGER NOT NULL,
    "sagaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_payment_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_payment_history_sagaId_key" ON "public"."customer_payment_history"("sagaId");
