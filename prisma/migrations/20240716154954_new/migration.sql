/*
  Warnings:

  - Added the required column `userId` to the `conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversation" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
