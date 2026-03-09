-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_id_treasury_destin_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_id_treasury_origin_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_id_type_operation_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_id_type_order_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_status_order_fkey`;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_type_operation_fkey` FOREIGN KEY (`id_type_operation`) REFERENCES `TypeOperation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_treasury_origin_fkey` FOREIGN KEY (`id_treasury_origin`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_treasury_destin_fkey` FOREIGN KEY (`id_treasury_destin`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_type_order_fkey` FOREIGN KEY (`id_type_order`) REFERENCES `TypeOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_status_order_fkey` FOREIGN KEY (`status_order`) REFERENCES `StatusOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
