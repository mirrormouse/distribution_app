/*
  Warnings:

  - A unique constraint covering the columns `[viewToken]` on the table `Preference` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "viewToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Preference_viewToken_key" ON "Preference"("viewToken");
