/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Treasury` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[short_name]` on the table `Treasury` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_number]` on the table `Treasury` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gmcore_number]` on the table `Treasury` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Atm" (
    "id" SERIAL NOT NULL,
    "id_system" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "id_treasury" INTEGER NOT NULL,

    CONSTRAINT "Atm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Atm_name_key" ON "Atm"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Atm_short_name_key" ON "Atm"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_name_key" ON "Treasury"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_short_name_key" ON "Treasury"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_account_number_key" ON "Treasury"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_gmcore_number_key" ON "Treasury"("gmcore_number");

-- AddForeignKey
ALTER TABLE "Atm" ADD CONSTRAINT "Atm_id_treasury_fkey" FOREIGN KEY ("id_treasury") REFERENCES "Treasury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
