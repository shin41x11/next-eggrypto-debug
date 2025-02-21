/*
  Warnings:

  - You are about to drop the `BlockChainMints` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `BlockChainMints`;

-- CreateTable
CREATE TABLE `BCMints` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenId` INTEGER UNSIGNED NOT NULL,
    `monsterId` INTEGER UNSIGNED NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
