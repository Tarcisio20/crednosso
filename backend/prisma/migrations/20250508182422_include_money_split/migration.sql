-- CreateTable
CREATE TABLE `MoneySplit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_treasury_origin` INTEGER NOT NULL,
    `id_treasury_rating` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MoneySplit` ADD CONSTRAINT `MoneySplit_id_treasury_origin_fkey` FOREIGN KEY (`id_treasury_origin`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneySplit` ADD CONSTRAINT `MoneySplit_id_treasury_rating_fkey` FOREIGN KEY (`id_treasury_rating`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
