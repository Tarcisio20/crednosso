-- DropForeignKey
ALTER TABLE `supply` DROP FOREIGN KEY `Supply_id_atm_fkey`;

-- DropIndex
DROP INDEX `Supply_id_atm_fkey` ON `supply`;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_id_atm_fkey` FOREIGN KEY (`id_atm`) REFERENCES `Atm`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
