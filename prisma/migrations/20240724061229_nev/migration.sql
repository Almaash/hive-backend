/*
  Warnings:

  - The `conversation_id` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversation_id",
ADD COLUMN     "conversation_id" INTEGER;
