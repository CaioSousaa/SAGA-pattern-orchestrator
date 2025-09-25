-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('STARTED', 'FAILED', 'FINISHED');

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'STARTED';
