-- CreateTable
CREATE TABLE "TypeOperation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "TypeOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypeOperation_name_key" ON "TypeOperation"("name");
