-- AlterTable
ALTER TABLE `typeoperation` ADD COLUMN `slug` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `typeorder` ADD COLUMN `slug` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `typestore` ADD COLUMN `slug` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `typesupply` ADD COLUMN `slug` VARCHAR(191) NOT NULL DEFAULT '';
