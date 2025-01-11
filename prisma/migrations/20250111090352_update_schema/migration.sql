/*
  Warnings:

  - The primary key for the `DT_Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `scoreBoardId` on the `DT_Result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DT_Result" DROP CONSTRAINT "DT_Result_scoreBoardId_studentId_fkey";

-- AlterTable
ALTER TABLE "DT_Result" DROP CONSTRAINT "DT_Result_pkey",
DROP COLUMN "scoreBoardId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "DT_Result_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "DT_ScoreBoard_Result" (
    "scoreBoardId" INTEGER NOT NULL,
    "dtResultId" INTEGER NOT NULL,

    CONSTRAINT "DT_ScoreBoard_Result_pkey" PRIMARY KEY ("scoreBoardId","dtResultId")
);

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ScoreBoard_Result" ADD CONSTRAINT "DT_ScoreBoard_Result_scoreBoardId_fkey" FOREIGN KEY ("scoreBoardId") REFERENCES "ScoreBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ScoreBoard_Result" ADD CONSTRAINT "DT_ScoreBoard_Result_dtResultId_fkey" FOREIGN KEY ("dtResultId") REFERENCES "DT_Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
