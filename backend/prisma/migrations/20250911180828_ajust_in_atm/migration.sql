-- DropForeignKey
ALTER TABLE `atm` DROP FOREIGN KEY `Atm_id_treasury_fkey`;

-- DropIndex
DROP INDEX `Atm_id_treasury_fkey` ON `atm`;

-- AddForeignKey
ALTER TABLE `Atm` ADD CONSTRAINT `Atm_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
