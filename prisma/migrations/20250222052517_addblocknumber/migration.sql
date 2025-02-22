/*
  Warnings:

  - A unique constraint covering the columns `[blockNumber]` on the table `BCMints` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blockNumber` to the `BCMints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BCMints` ADD COLUMN `blockNumber` VARCHAR(63) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `BCMints_blockNumber_key` ON `BCMints`(`blockNumber`);
