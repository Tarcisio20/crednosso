-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "id_treasury" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_id_treasury_fkey" FOREIGN KEY ("id_treasury") REFERENCES "Treasury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
