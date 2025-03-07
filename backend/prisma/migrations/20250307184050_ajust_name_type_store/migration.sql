/*
  Warnings:

  - You are about to drop the `typesore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `treasury` DROP FOREIGN KEY `Treasury_id_type_store_fkey`;

-- DropIndex
DROP INDEX `Treasury_id_type_store_fkey` ON `treasury`;

-- DropTable
DROP TABLE `typesore`;

-- CreateTable
CREATE TABLE `typeStore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `typeStore_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Treasury` ADD CONSTRAINT `Treasury_id_type_store_fkey` FOREIGN KEY (`id_type_store`) REFERENCES `typeStore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
