-- CreateTable
CREATE TABLE `OperationalError` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_treasury` INTEGER NOT NULL,
    `num_os` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OperationalError` ADD CONSTRAINT `OperationalError_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
