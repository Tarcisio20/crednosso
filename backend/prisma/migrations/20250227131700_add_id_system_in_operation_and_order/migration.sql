/*
  Warnings:

  - Added the required column `id_system` to the `TypeOperation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_system` to the `TypeOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `typeoperation` ADD COLUMN `id_system` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `typeorder` ADD COLUMN `id_system` INTEGER NOT NULL;
