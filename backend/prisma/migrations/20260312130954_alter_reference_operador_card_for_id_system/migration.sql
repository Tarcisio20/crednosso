-- DropForeignKey
ALTER TABLE `operatorcard` DROP FOREIGN KEY `OperatorCard_id_treasury_fkey`;

-- DropIndex
DROP INDEX `OperatorCard_id_treasury_fkey` ON `operatorcard`;

-- AddForeignKey
ALTER TABLE `OperatorCard` ADD CONSTRAINT `OperatorCard_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
