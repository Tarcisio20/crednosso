/*
  Warnings:

  - You are about to drop the column `value_A` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `value_B` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `value_C` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `value_D` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `value_A`,
    DROP COLUMN `value_B`,
    DROP COLUMN `value_C`,
    DROP COLUMN `value_D`;
