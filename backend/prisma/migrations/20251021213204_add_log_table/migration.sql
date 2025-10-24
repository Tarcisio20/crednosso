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
