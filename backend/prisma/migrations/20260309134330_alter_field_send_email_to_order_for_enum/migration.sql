/*
  Warnings:

  - You are about to alter the column `send_email` on the `order` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `send_email` ENUM('PENDENTE', 'ENVIADO', 'ERROR') NOT NULL DEFAULT 'PENDENTE';
