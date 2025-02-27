/*
  Warnings:

  - Added the required column `id_treasury` to the `OperatorCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `operatorcard` ADD COLUMN `id_treasury` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `OperatorCard` ADD CONSTRAINT `OperatorCard_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
