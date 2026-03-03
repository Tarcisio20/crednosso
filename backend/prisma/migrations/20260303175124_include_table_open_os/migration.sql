-- CreateTable
CREATE TABLE `OsOpen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_atm` VARCHAR(191) NOT NULL,
    `os` VARCHAR(191) NOT NULL,
    `situacao` VARCHAR(191) NOT NULL,
    `valor` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
