-- CreateTable
CREATE TABLE "conversation" (
    "id" SERIAL NOT NULL,
    "members" TEXT[],

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);
