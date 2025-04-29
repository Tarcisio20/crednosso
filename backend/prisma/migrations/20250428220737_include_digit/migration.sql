-- AlterTable
ALTER TABLE `accountbank` ADD COLUMN `account_digit` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `bank_branch_digit` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `bank_branch` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `account` VARCHAR(191) NOT NULL DEFAULT '';
