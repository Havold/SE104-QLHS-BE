-- DropForeignKey
ALTER TABLE "DT_ScoreBoard" DROP CONSTRAINT "DT_ScoreBoard_studentId_fkey";

-- AddForeignKey
ALTER TABLE "DT_ScoreBoard" ADD CONSTRAINT "DT_ScoreBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
