-- DropForeignKey
ALTER TABLE "DT_ScoreBoard" DROP CONSTRAINT "DT_ScoreBoard_scoreBoardId_fkey";

-- AddForeignKey
ALTER TABLE "DT_ScoreBoard" ADD CONSTRAINT "DT_ScoreBoard_scoreBoardId_fkey" FOREIGN KEY ("scoreBoardId") REFERENCES "ScoreBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
