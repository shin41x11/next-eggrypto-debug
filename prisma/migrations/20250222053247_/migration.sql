/*
  Warnings:

  - You are about to alter the column `lastBlockNumber` on the `BCLoads` table. The data in that column could be lost. The data in that column will be cast from `VarChar(63)` to `UnsignedInt`.
  - You are about to alter the column `blockNumber` on the `BCMints` table. The data in that column could be lost. The data in that column will be cast from `VarChar(63)` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `BCLoads` MODIFY `lastBlockNumber` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `BCMints` MODIFY `blockNumber` INTEGER UNSIGNED NOT NULL;
