-- DropForeignKey
ALTER TABLE "DT_Result" DROP CONSTRAINT "DT_Result_resultId_fkey";

-- DropForeignKey
ALTER TABLE "DT_Result" DROP CONSTRAINT "DT_Result_subjectId_fkey";

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
