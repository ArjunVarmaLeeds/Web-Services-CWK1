/*
  Warnings:

  - A unique constraint covering the columns `[playerId,cardName]` on the table `PlayerCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iconUrl` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arena` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Card` ADD COLUMN `iconUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Player` ADD COLUMN `arena` VARCHAR(191) NOT NULL,
    ADD COLUMN `favouriteCardName` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PlayerDeck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `cardName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PlayerDeck_playerId_cardName_key`(`playerId`, `cardName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `PlayerCard_playerId_cardName_key` ON `PlayerCard`(`playerId`, `cardName`);

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_favouriteCardName_fkey` FOREIGN KEY (`favouriteCardName`) REFERENCES `Card`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerDeck` ADD CONSTRAINT `PlayerDeck_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerDeck` ADD CONSTRAINT `PlayerDeck_cardName_fkey` FOREIGN KEY (`cardName`) REFERENCES `Card`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
