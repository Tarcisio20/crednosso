-- CreateTable
CREATE TABLE `TreasuryCashBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_treasury` INTEGER NOT NULL,
    `available_bills_10` INTEGER NOT NULL DEFAULT 0,
    `available_bills_20` INTEGER NOT NULL DEFAULT 0,
    `available_bills_50` INTEGER NOT NULL DEFAULT 0,
    `available_bills_100` INTEGER NOT NULL DEFAULT 0,
    `transit_bills_10` INTEGER NOT NULL DEFAULT 0,
    `transit_bills_20` INTEGER NOT NULL DEFAULT 0,
    `transit_bills_50` INTEGER NOT NULL DEFAULT 0,
    `transit_bills_100` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TreasuryCashBalance_id_treasury_key`(`id_treasury`),
    INDEX `TreasuryCashBalance_id_treasury_idx`(`id_treasury`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TreasuryCashMovementItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movement_id` INTEGER NOT NULL,
    `balance_bucket` ENUM('DISPONIVEL', 'TRANSICAO') NOT NULL,
    `denomination` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TreasuryCashMovementItem_balance_bucket_idx`(`balance_bucket`),
    INDEX `TreasuryCashMovementItem_denomination_idx`(`denomination`),
    UNIQUE INDEX `TreasuryCashMovementItem_movement_id_balance_bucket_denomina_key`(`movement_id`, `balance_bucket`, `denomination`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TreasuryCashMovement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movement_key` VARCHAR(191) NOT NULL,
    `id_treasury` INTEGER NOT NULL,
    `id_order` INTEGER NULL,
    `id_os_open` INTEGER NULL,
    `type` ENUM('ENTRADA_PEDIDO', 'ABERTURA_OS', 'AJUSTE_CONFIRMACAO_PEDIDO', 'AJUSTE_OS', 'FINALIZACAO_OS', 'CANCELAMENTO_OS', 'AJUSTE_MANUAL') NOT NULL,
    `status` ENUM('PENDENTE', 'CONFIRMADO', 'CANCELADO') NOT NULL DEFAULT 'CONFIRMADO',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `source_table` VARCHAR(100) NULL,
    `source_id` INTEGER NULL,
    `createdBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TreasuryCashMovement_movement_key_key`(`movement_key`),
    INDEX `TreasuryCashMovement_id_treasury_createdAt_idx`(`id_treasury`, `createdAt`),
    INDEX `TreasuryCashMovement_type_status_idx`(`type`, `status`),
    INDEX `TreasuryCashMovement_source_table_source_id_idx`(`source_table`, `source_id`),
    INDEX `TreasuryCashMovement_id_order_idx`(`id_order`),
    INDEX `TreasuryCashMovement_id_os_open_idx`(`id_os_open`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TreasuryCashBalance` ADD CONSTRAINT `TreasuryCashBalance_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryCashMovementItem` ADD CONSTRAINT `TreasuryCashMovementItem_movement_id_fkey` FOREIGN KEY (`movement_id`) REFERENCES `TreasuryCashMovement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryCashMovement` ADD CONSTRAINT `TreasuryCashMovement_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryCashMovement` ADD CONSTRAINT `TreasuryCashMovement_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryCashMovement` ADD CONSTRAINT `TreasuryCashMovement_id_os_open_fkey` FOREIGN KEY (`id_os_open`) REFERENCES `OsOpen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
