-- CreateTable
CREATE TABLE "OperatorCard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "OperatorCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OperatorCard_name_key" ON "OperatorCard"("name");
