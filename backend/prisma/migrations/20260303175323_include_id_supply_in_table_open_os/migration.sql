/*
  Warnings:

  - Added the required column `id_supply` to the `OsOpen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `osopen` ADD COLUMN `id_supply` INTEGER NOT NULL;
