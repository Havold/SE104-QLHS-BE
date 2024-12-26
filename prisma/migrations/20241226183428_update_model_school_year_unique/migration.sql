/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `SchoolYear` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SchoolYear_value_key" ON "SchoolYear"("value");
