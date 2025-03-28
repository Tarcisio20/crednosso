/*
  Warnings:

  - A unique constraint covering the columns `[id_system]` on the table `Atm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Atm_id_system_key` ON `Atm`(`id_system`);
