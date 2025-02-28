/*
  Warnings:

  - You are about to drop the column `store` on the `treasury` table. All the data in the column will be lost.
  - Added the required column `number_store` to the `Atm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Treasury_store_key` ON `treasury`;

-- AlterTable
ALTER TABLE `atm` ADD COLUMN `number_store` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `treasury` DROP COLUMN `store`;
