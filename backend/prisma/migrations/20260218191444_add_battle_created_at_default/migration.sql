/*
  Warnings:

  - Added the required column `battleTime` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Battle` ADD COLUMN `battleTime` DATETIME(3) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
