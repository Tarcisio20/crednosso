-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_slug_key`(`slug`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treasury` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(191) NOT NULL,
    `gmcore_number` VARCHAR(191) NOT NULL,
    `store` VARCHAR(191) NOT NULL,
    `region` INTEGER NOT NULL,
    `bills_10` INTEGER NOT NULL DEFAULT 0,
    `bills_20` INTEGER NOT NULL DEFAULT 0,
    `bills_50` INTEGER NOT NULL DEFAULT 0,
    `bills_100` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Treasury_id_system_key`(`id_system`),
    UNIQUE INDEX `Treasury_name_key`(`name`),
    UNIQUE INDEX `Treasury_short_name_key`(`short_name`),
    UNIQUE INDEX `Treasury_account_number_key`(`account_number`),
    UNIQUE INDEX `Treasury_store_key`(`store`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Atm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `id_treasury` INTEGER NOT NULL,
    `cassete_A` INTEGER NOT NULL,
    `cassete_B` INTEGER NOT NULL,
    `cassete_C` INTEGER NOT NULL,
    `cassete_D` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Atm_name_key`(`name`),
    UNIQUE INDEX `Atm_short_name_key`(`short_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeOperation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `TypeOperation_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_system` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `TypeOrder_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeSupply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `TypeSupply_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `typeStore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `typeStore_name_key`(`name`),
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperatorCard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_treasury` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number_card` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `OperatorCard_name_key`(`name`),
    UNIQUE INDEX `OperatorCard_number_card_key`(`number_card`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Atm` ADD CONSTRAINT `Atm_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperatorCard` ADD CONSTRAINT `OperatorCard_id_treasury_fkey` FOREIGN KEY (`id_treasury`) REFERENCES `Treasury`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
