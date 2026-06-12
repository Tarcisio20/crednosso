-- CreateTable
CREATE TABLE `atm_service_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num_os` INTEGER NOT NULL,
    `id_atm` INTEGER NOT NULL,
    `name_atm` VARCHAR(191) NOT NULL DEFAULT '',
    `tipo_os` VARCHAR(191) NOT NULL DEFAULT '',
    `datas_geracao` VARCHAR(191) NOT NULL DEFAULT '',
    `situacao_os` VARCHAR(191) NOT NULL DEFAULT '',
    `data_atendimento` VARCHAR(191) NOT NULL DEFAULT '',
    `data_conclusao` VARCHAR(191) NOT NULL DEFAULT '',
    `transportadora_id` INTEGER NOT NULL,
    `transportadora_nome` VARCHAR(191) NOT NULL DEFAULT '',
    `operador` VARCHAR(191) NOT NULL DEFAULT '',
    `suprimento` VARCHAR(191) NOT NULL DEFAULT '',
    `recolhimento` VARCHAR(191) NOT NULL DEFAULT '',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `atm_service_order_num_os_key`(`num_os`),
    INDEX `atm_service_order_id_atm_idx`(`id_atm`),
    INDEX `atm_service_order_num_os_idx`(`num_os`),
    INDEX `atm_service_order_situacao_os_idx`(`situacao_os`),
    INDEX `atm_service_order_transportadora_id_idx`(`transportadora_id`),
    INDEX `atm_service_order_date_idx`(`date`),
    INDEX `atm_service_order_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `atm_service_order` ADD CONSTRAINT `atm_service_order_id_atm_fkey` FOREIGN KEY (`id_atm`) REFERENCES `Atm`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
