-- CreateTable
CREATE TABLE `AccountBank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `bank_branch` VARCHAR(191) NOT NULL DEFAULT '',
    `account` VARCHAR(191) NOT NULL DEFAULT '',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `account_digit` VARCHAR(191) NOT NULL DEFAULT '',
    `bank_branch_digit` VARCHAR(191) NOT NULL DEFAULT '',
    `hash` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'mateus',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Atm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `id_treasury` INTEGER NOT NULL,
    `number_store` INTEGER NOT NULL,
    `cassete_A` INTEGER NOT NULL,
    `cassete_B` INTEGER NOT NULL,
    `cassete_C` INTEGER NOT NULL,
    `cassete_D` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Atm_id_system_key`(`id_system`),
    UNIQUE INDEX `Atm_name_key`(`name`),
    UNIQUE INDEX `Atm_short_name_key`(`short_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_treasury` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MoneySplit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` INTEGER NOT NULL,
    `id_treasury_origin` INTEGER NOT NULL,
    `id_treasury_rating` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MoneySplitRefund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` INTEGER NOT NULL,
    `id_treasury_origin` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationalError` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_treasury` INTEGER NOT NULL,
    `num_os` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperatorCard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_treasury` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number_card` VARCHAR(191) NOT NULL,
    `inUse` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OperatorCard_number_card_key`(`number_card`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_type_operation` INTEGER NOT NULL,
    `id_treasury_origin` INTEGER NOT NULL,
    `id_treasury_destin` INTEGER NOT NULL,
    `date_order` DATETIME(3) NOT NULL,
    `id_type_order` INTEGER NOT NULL,
    `requested_value_A` INTEGER NOT NULL,
    `requested_value_B` INTEGER NOT NULL,
    `requested_value_C` INTEGER NOT NULL,
    `requested_value_D` INTEGER NOT NULL,
    `composition_change` BOOLEAN NOT NULL DEFAULT false,
    `confirmed_value_A` INTEGER NOT NULL DEFAULT 0,
    `confirmed_value_B` INTEGER NOT NULL DEFAULT 0,
    `confirmed_value_C` INTEGER NOT NULL DEFAULT 0,
    `confirmed_value_D` INTEGER NOT NULL DEFAULT 0,
    `observation` VARCHAR(191) NOT NULL DEFAULT '',
    `for_payment` BOOLEAN NULL DEFAULT false,
    `for_release` BOOLEAN NULL DEFAULT false,
    `status_order` INTEGER NOT NULL,
    `send_email_status` ENUM('PENDENTE', 'ENVIADO', 'ERROR') NOT NULL DEFAULT 'PENDENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatusOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StatusOrder_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_atm` INTEGER NOT NULL,
    `id_order` INTEGER NOT NULL,
    `id_treasury` INTEGER NOT NULL,
    `cassete_A` INTEGER NOT NULL,
    `cassete_B` INTEGER NOT NULL,
    `cassete_C` INTEGER NOT NULL,
    `cassete_D` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_on_supply` DATETIME(3) NOT NULL,
    `total_exchange` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treasury` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `id_type_supply` INTEGER NOT NULL,
    `id_type_store` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `name_for_email` VARCHAR(191) NOT NULL DEFAULT '',
    `short_name` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(191) NOT NULL,
    `gmcore_number` VARCHAR(191) NOT NULL,
    `enabled_gmcore` BOOLEAN NOT NULL DEFAULT true,
    `region` INTEGER NOT NULL,
    `bills_10` INTEGER NOT NULL DEFAULT 0,
    `bills_20` INTEGER NOT NULL DEFAULT 0,
    `bills_50` INTEGER NOT NULL DEFAULT 0,
    `bills_100` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `account_number_for_transfer` VARCHAR(191) NOT NULL DEFAULT '',
    `expected_cash_balance` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Treasury_id_system_key`(`id_system`),
    UNIQUE INDEX `Treasury_name_key`(`name`),
    UNIQUE INDEX `Treasury_short_name_key`(`short_name`),
    UNIQUE INDEX `Treasury_account_number_key`(`account_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeOperation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TypeOperation_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TypeOrder_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `typeStore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `typeStore_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeSupply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TypeSupply_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nivel` VARCHAR(191) NOT NULL DEFAULT 'user',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_slug_key`(`slug`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` ENUM('INFO', 'WARN', 'ERROR', 'DEBUG') NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `message` TEXT NULL,
    `userSlug` VARCHAR(191) NULL,
    `route` VARCHAR(255) NULL,
    `method` VARCHAR(10) NULL,
    `statusCode` INTEGER NULL,
    `resource` VARCHAR(100) NULL,
    `resourceId` VARCHAR(100) NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Log_createdAt_idx`(`createdAt`),
    INDEX `Log_userSlug_idx`(`userSlug`),
    INDEX `Log_level_createdAt_idx`(`level`, `createdAt`),
    INDEX `Log_action_createdAt_idx`(`action`, `createdAt`),
    INDEX `Log_route_method_idx`(`route`, `method`),
    INDEX `Log_resource_resourceId_idx`(`resource`, `resourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsOpen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_supply` INTEGER NOT NULL,
    `id_atm` VARCHAR(191) NOT NULL,
    `os` VARCHAR(191) NOT NULL,
    `situacao` VARCHAR(191) NOT NULL,
    `valor` VARCHAR(191) NOT NULL,
    `date_os` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `send_email` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailParametrization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `for_send_slug` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `EmailParametrization_email_key`(`email`),
    INDEX `EmailParametrization_for_send_slug_idx`(`for_send_slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `AtmMonitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_atm` INTEGER NOT NULL,
    `name_atm` VARCHAR(191) NOT NULL,
    `ativo_atm` VARCHAR(191) NOT NULL,
    `saldo_logico` VARCHAR(191) NOT NULL,
    `saldo_rejeicao` VARCHAR(191) NOT NULL,
    `total_logico` VARCHAR(191) NOT NULL,
    `saldo_conta` VARCHAR(191) NOT NULL,
    `cassete_a` VARCHAR(191) NOT NULL,
    `cassete_a_rejeicao` VARCHAR(191) NOT NULL,
    `cassete_a_cedula` VARCHAR(191) NOT NULL,
    `cassete_a_ativo` VARCHAR(191) NOT NULL,
    `cassete_a_habilitado` VARCHAR(191) NOT NULL,
    `cassete_b` VARCHAR(191) NOT NULL,
    `cassete_b_rejeicao` VARCHAR(191) NOT NULL,
    `cassete_b_cedula` VARCHAR(191) NOT NULL,
    `cassete_b_ativo` VARCHAR(191) NOT NULL,
    `cassete_b_habilitado` VARCHAR(191) NOT NULL,
    `cassete_c` VARCHAR(191) NOT NULL,
    `cassete_c_rejeicao` VARCHAR(191) NOT NULL,
    `cassete_c_cedula` VARCHAR(191) NOT NULL,
    `cassete_c_ativo` VARCHAR(191) NOT NULL,
    `cassete_c_habilitado` VARCHAR(191) NOT NULL,
    `cassete_d` VARCHAR(191) NOT NULL,
    `cassete_d_rejeicao` VARCHAR(191) NOT NULL,
    `cassete_d_cedula` VARCHAR(191) NOT NULL,
    `cassete_d_ativo` VARCHAR(191) NOT NULL,
    `cassete_d_habilitado` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Atm` ADD CONSTRAINT `Atm_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneySplit` ADD CONSTRAINT `MoneySplit_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneySplit` ADD CONSTRAINT `MoneySplit_id_treasury_origin_fkey` FOREIGN KEY (`id_treasury_origin`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneySplit` ADD CONSTRAINT `MoneySplit_id_treasury_rating_fkey` FOREIGN KEY (`id_treasury_rating`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneySplitRefund` ADD CONSTRAINT `MoneySplitRefund_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoneySplitRefund` ADD CONSTRAINT `MoneySplitRefund_id_treasury_origin_fkey` FOREIGN KEY (`id_treasury_origin`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalError` ADD CONSTRAINT `OperationalError_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperatorCard` ADD CONSTRAINT `OperatorCard_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_type_operation_fkey` FOREIGN KEY (`id_type_operation`) REFERENCES `TypeOperation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_treasury_origin_fkey` FOREIGN KEY (`id_treasury_origin`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_treasury_destin_fkey` FOREIGN KEY (`id_treasury_destin`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_type_order_fkey` FOREIGN KEY (`id_type_order`) REFERENCES `TypeOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_status_order_fkey` FOREIGN KEY (`status_order`) REFERENCES `StatusOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_id_atm_fkey` FOREIGN KEY (`id_atm`) REFERENCES `Atm`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treasury` ADD CONSTRAINT `Treasury_id_type_supply_fkey` FOREIGN KEY (`id_type_supply`) REFERENCES `TypeSupply`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treasury` ADD CONSTRAINT `Treasury_id_type_store_fkey` FOREIGN KEY (`id_type_store`) REFERENCES `typeStore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `AtmMonitoring` ADD CONSTRAINT `AtmMonitoring_id_atm_fkey` FOREIGN KEY (`id_atm`) REFERENCES `Atm`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
