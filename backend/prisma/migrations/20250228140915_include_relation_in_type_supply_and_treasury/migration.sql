/*
  Warnings:

  - You are about to drop the `typestore` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_type_supply` to the `Treasury` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `atm` ADD COLUMN `enabled_gmcore` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `treasury` ADD COLUMN `id_type_supply` INTEGER NOT NULL;

-- DropTable
DROP TABLE `typestore`;

-- AddForeignKey
ALTER TABLE `Treasury` ADD CONSTRAINT `Treasury_id_type_supply_fkey` FOREIGN KEY (`id_type_supply`) REFERENCES `TypeSupply`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
