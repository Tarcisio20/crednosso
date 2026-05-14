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
ALTER TABLE `AtmMonitoring` ADD CONSTRAINT `AtmMonitoring_id_atm_fkey` FOREIGN KEY (`id_atm`) REFERENCES `Atm`(`id_system`) ON DELETE RESTRICT ON UPDATE CASCADE;
