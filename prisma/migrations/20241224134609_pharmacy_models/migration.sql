/*
  Warnings:

  - A unique constraint covering the columns `[medicinieName]` on the table `Medicines` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Medicines_medicinieName_key" ON "Medicines"("medicinieName");
