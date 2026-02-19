-- AddForeignKey
ALTER TABLE `PlayerCard` ADD CONSTRAINT `PlayerCard_cardName_fkey` FOREIGN KEY (`cardName`) REFERENCES `Card`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
