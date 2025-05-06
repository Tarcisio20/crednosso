/*
  Warnings:

  - Added the required column `date_on_supply` to the `Supply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supply` ADD COLUMN `date_on_supply` DATETIME(3) NOT NULL;
