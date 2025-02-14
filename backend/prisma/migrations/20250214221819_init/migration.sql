-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Treasury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atm" (
    "id" SERIAL NOT NULL,
    "id_system" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "id_treasury" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Atm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOperation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TypeOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOrder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TypeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "id_treasury" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorCard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OperatorCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_id_system_key" ON "Treasury"("id_system");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_name_key" ON "Treasury"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_short_name_key" ON "Treasury"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_account_number_key" ON "Treasury"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_gmcore_number_key" ON "Treasury"("gmcore_number");

-- CreateIndex
CREATE UNIQUE INDEX "Atm_name_key" ON "Atm"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Atm_short_name_key" ON "Atm"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "TypeOperation_name_key" ON "TypeOperation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TypeOrder_name_key" ON "TypeOrder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorCard_name_key" ON "OperatorCard"("name");

-- AddForeignKey
ALTER TABLE "Atm" ADD CONSTRAINT "Atm_id_treasury_fkey" FOREIGN KEY ("id_treasury") REFERENCES "Treasury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_id_treasury_fkey" FOREIGN KEY ("id_treasury") REFERENCES "Treasury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
