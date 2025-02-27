/*
  Warnings:

  - A unique constraint covering the columns `[number_card]` on the table `OperatorCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number_card` to the `OperatorCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `operatorcard` ADD COLUMN `number_card` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OperatorCard_number_card_key` ON `OperatorCard`(`number_card`);
