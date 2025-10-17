-- AlterTable
ALTER TABLE `order` ADD COLUMN `for_payment` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `for_release` BOOLEAN NULL DEFAULT false;
