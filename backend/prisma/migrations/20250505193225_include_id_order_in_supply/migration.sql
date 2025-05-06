/*
  Warnings:

  - Added the required column `id_order` to the `Supply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supply` ADD COLUMN `id_order` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
