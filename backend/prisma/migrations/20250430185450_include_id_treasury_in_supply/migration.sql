/*
  Warnings:

  - Added the required column `id_treasury` to the `Supply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supply` ADD COLUMN `id_treasury` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
