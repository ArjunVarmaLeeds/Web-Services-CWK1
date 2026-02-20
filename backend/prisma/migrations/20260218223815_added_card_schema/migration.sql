-- CreateTable
CREATE TABLE `Card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `maxLevel` INTEGER NOT NULL,
    `elixir` INTEGER NOT NULL,
    `rarity` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Card_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
