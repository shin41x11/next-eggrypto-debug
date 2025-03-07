-- CreateTable
CREATE TABLE `create_monster_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `blockNumber` BIGINT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `transactionHash` VARCHAR(191) NOT NULL,
    `tokenId` VARCHAR(191) NOT NULL,
    `monsterId` VARCHAR(191) NOT NULL,
    `supplyNumber` VARCHAR(191) NOT NULL,
    `supplyLimit` VARCHAR(191) NOT NULL,
    `userMonsterId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `create_monster_events_transactionHash_key`(`transactionHash`),
    INDEX `create_monster_events_blockNumber_idx`(`blockNumber`),
    INDEX `create_monster_events_timestamp_idx`(`timestamp`),
    INDEX `create_monster_events_monsterId_idx`(`monsterId`),
    INDEX `create_monster_events_tokenId_idx`(`tokenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
