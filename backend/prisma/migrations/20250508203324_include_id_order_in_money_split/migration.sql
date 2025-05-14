/*
  Warnings:

  - Added the required column `id_order` to the `MoneySplit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `moneysplit` ADD COLUMN `id_order` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `MoneySplit` ADD CONSTRAINT `MoneySplit_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
