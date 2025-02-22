/*
  Warnings:

  - You are about to alter the column `envType` on the `BCLoads` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Enum(EnumId(0))`.
  - You are about to alter the column `loadType` on the `BCLoads` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `BCLoads` MODIFY `envType` ENUM('MAINNET', 'TESTNET') NOT NULL,
    MODIFY `loadType` ENUM('MONSTER', 'MINT') NOT NULL;
