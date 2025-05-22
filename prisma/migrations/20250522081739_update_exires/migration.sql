/*
  Warnings:

  - You are about to drop the column `exiresAt` on the `refreshtoken` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `refreshtoken` DROP COLUMN `exiresAt`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;
