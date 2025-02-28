/*
  Warnings:

  - You are about to drop the column `enabled_gmcore` on the `atm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `atm` DROP COLUMN `enabled_gmcore`;

-- AlterTable
ALTER TABLE `treasury` ADD COLUMN `enabled_gmcore` BOOLEAN NOT NULL DEFAULT true;
