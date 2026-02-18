/*
  Warnings:

  - You are about to drop the column `gameName` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `puuid` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `tagLine` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `FavoritePlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rank` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tag]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bestTrophies` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `losses` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trophies` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wins` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `FavoritePlayer` DROP FOREIGN KEY `FavoritePlayer_playerId_fkey`;

-- DropForeignKey
ALTER TABLE `FavoritePlayer` DROP FOREIGN KEY `FavoritePlayer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MatchPlayer` DROP FOREIGN KEY `MatchPlayer_matchId_fkey`;

-- DropForeignKey
ALTER TABLE `MatchPlayer` DROP FOREIGN KEY `MatchPlayer_playerId_fkey`;

-- DropForeignKey
ALTER TABLE `Rank` DROP FOREIGN KEY `Rank_playerId_fkey`;

-- DropIndex
DROP INDEX `Player_puuid_key` ON `Player`;

-- AlterTable
ALTER TABLE `Player` DROP COLUMN `gameName`,
    DROP COLUMN `lastUpdated`,
    DROP COLUMN `puuid`,
    DROP COLUMN `region`,
    DROP COLUMN `tagLine`,
    ADD COLUMN `bestTrophies` INTEGER NOT NULL,
    ADD COLUMN `losses` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `tag` VARCHAR(191) NOT NULL,
    ADD COLUMN `trophies` INTEGER NOT NULL,
    ADD COLUMN `wins` INTEGER NOT NULL;

-- DropTable
DROP TABLE `FavoritePlayer`;

-- DropTable
DROP TABLE `Match`;

-- DropTable
DROP TABLE `MatchPlayer`;

-- DropTable
DROP TABLE `Rank`;

-- CreateTable
CREATE TABLE `Battle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `result` VARCHAR(191) NOT NULL,
    `crowns` INTEGER NOT NULL,
    `gameMode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerCard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `cardName` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Player_tag_key` ON `Player`(`tag`);

-- AddForeignKey
ALTER TABLE `Battle` ADD CONSTRAINT `Battle_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerCard` ADD CONSTRAINT `PlayerCard_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
