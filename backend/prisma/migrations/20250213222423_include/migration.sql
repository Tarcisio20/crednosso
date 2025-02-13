/*
  Warnings:

  - Added the required column `status` to the `Atm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Atm" ADD COLUMN     "status" BOOLEAN NOT NULL;
