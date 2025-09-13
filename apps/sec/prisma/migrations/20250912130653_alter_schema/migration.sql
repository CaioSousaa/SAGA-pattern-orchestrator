-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'COMPLETED', 'IN_PROGRESS', 'FAILED', 'ACTION_COMPENSATORY', 'COMPENSATED');

-- CreateTable
CREATE TABLE "public"."sec" (
    "id" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL,
    "name_flow" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."action" (
    "id" SERIAL NOT NULL,
    "name_action" TEXT NOT NULL,
    "saga_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sec_id_key" ON "public"."sec"("id");

-- CreateIndex
CREATE UNIQUE INDEX "action_id_key" ON "public"."action"("id");

-- AddForeignKey
ALTER TABLE "public"."action" ADD CONSTRAINT "action_saga_id_fkey" FOREIGN KEY ("saga_id") REFERENCES "public"."sec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
