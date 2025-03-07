-- AlterTable
ALTER TABLE `treasury` ADD COLUMN `id_origin_order` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `typeSore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `typeSore_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Treasury` ADD CONSTRAINT `Treasury_id_origin_order_fkey` FOREIGN KEY (`id_origin_order`) REFERENCES `typeSore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
