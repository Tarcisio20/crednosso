/*
  Warnings:

  - Added the required column `cassete_A` to the `Atm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cassete_B` to the `Atm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cassete_C` to the `Atm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cassete_D` to the `Atm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `atm` ADD COLUMN `cassete_A` INTEGER NOT NULL,
    ADD COLUMN `cassete_B` INTEGER NOT NULL,
    ADD COLUMN `cassete_C` INTEGER NOT NULL,
    ADD COLUMN `cassete_D` INTEGER NOT NULL;
