/*
  Warnings:

  - You are about to drop the column `id_origin_order` on the `treasury` table. All the data in the column will be lost.
  - Added the required column `id_type_store` to the `Treasury` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `treasury` DROP FOREIGN KEY `Treasury_id_origin_order_fkey`;

-- DropIndex
DROP INDEX `Treasury_id_origin_order_fkey` ON `treasury`;

-- AlterTable
ALTER TABLE `treasury` DROP COLUMN `id_origin_order`,
    ADD COLUMN `id_type_store` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Treasury` ADD CONSTRAINT `Treasury_id_type_store_fkey` FOREIGN KEY (`id_type_store`) REFERENCES `typeSore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
