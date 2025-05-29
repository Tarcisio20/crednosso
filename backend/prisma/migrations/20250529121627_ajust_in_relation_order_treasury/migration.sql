-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_id_treasury_destin_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_id_treasury_origin_fkey`;

-- DropIndex
DROP INDEX `Order_id_treasury_destin_fkey` ON `order`;

-- DropIndex
DROP INDEX `Order_id_treasury_origin_fkey` ON `order`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_treasury_origin_fkey` FOREIGN KEY (`id_treasury_origin`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_treasury_destin_fkey` FOREIGN KEY (`id_treasury_destin`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
