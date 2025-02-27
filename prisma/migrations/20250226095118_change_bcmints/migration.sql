/*
  Warnings:

  - Added the required column `blockTimestamp` to the `BCMints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BCMints` ADD COLUMN `blockTimestamp` TIMESTAMP(0) NOT NULL,
    MODIFY `monsterId` INTEGER UNSIGNED NOT NULL DEFAULT 0;
