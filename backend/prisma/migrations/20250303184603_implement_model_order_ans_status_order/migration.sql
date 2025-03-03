-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_type_operation` INTEGER NOT NULL,
    `id_treasury_origin` INTEGER NOT NULL,
    `id_treasury_destin` INTEGER NOT NULL,
    `date_order` DATETIME(3) NOT NULL,
    `id_type_order` INTEGER NOT NULL,
    `value_A` INTEGER NOT NULL,
    `value_B` INTEGER NOT NULL,
    `value_C` INTEGER NOT NULL,
    `value_D` INTEGER NOT NULL,
    `requested_value_A` INTEGER NOT NULL,
    `requested_value_B` INTEGER NOT NULL,
    `requested_value_C` INTEGER NOT NULL,
    `requested_value_D` INTEGER NOT NULL,
    `composition_change` BOOLEAN NOT NULL DEFAULT false,
    `confirmed_value_A` INTEGER NOT NULL DEFAULT 0,
    `confirmed_value_B` INTEGER NOT NULL DEFAULT 0,
    `confirmed_value_C` INTEGER NOT NULL DEFAULT 0,
    `confirmed_value_D` INTEGER NOT NULL DEFAULT 0,
    `status_order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatusOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `StatusOrder_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_type_operation_fkey` FOREIGN KEY (`id_type_operation`) REFERENCES `TypeOperation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_treasury_origin_fkey` FOREIGN KEY (`id_treasury_origin`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_treasury_destin_fkey` FOREIGN KEY (`id_treasury_destin`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_type_order_fkey` FOREIGN KEY (`id_type_order`) REFERENCES `TypeOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_status_order_fkey` FOREIGN KEY (`status_order`) REFERENCES `StatusOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
