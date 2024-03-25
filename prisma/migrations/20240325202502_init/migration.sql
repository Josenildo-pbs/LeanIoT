/*
  Warnings:

  - You are about to drop the column `user_id` on the `DeviceMessage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeviceMessage" DROP CONSTRAINT "DeviceMessage_user_id_fkey";

-- AlterTable
ALTER TABLE "DeviceMessage" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "UserMessage" (
    "message_id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMessage_pkey" PRIMARY KEY ("message_id")
);

-- AddForeignKey
ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
