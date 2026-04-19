-- AlterTable
ALTER TABLE `budgets` ADD COLUMN `periodDay` INTEGER NULL;

-- AlterTable
ALTER TABLE `expenses` ADD COLUMN `status` ENUM('ACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX `expenses_userId_status_idx` ON `expenses`(`userId`, `status`);
