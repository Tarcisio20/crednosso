-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_id_treasury_fkey`;

-- DropIndex
DROP INDEX `Contact_id_treasury_fkey` ON `contact`;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
