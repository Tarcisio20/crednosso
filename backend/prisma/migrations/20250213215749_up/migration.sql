-- CreateTable
CREATE TABLE "Treasury" (
    "id" SERIAL NOT NULL,
    "id_system" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "gmcore_number" TEXT NOT NULL,
    "bills_10" INTEGER NOT NULL,
    "bills_20" INTEGER NOT NULL,
    "bills_50" INTEGER NOT NULL,
    "bills_100" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Treasury_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_id_system_key" ON "Treasury"("id_system");
