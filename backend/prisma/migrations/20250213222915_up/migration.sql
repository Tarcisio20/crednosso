-- CreateTable
CREATE TABLE "TypeOrder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "TypeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypeOrder_name_key" ON "TypeOrder"("name");
