-- DropForeignKey
ALTER TABLE "DT_ReportSemester" DROP CONSTRAINT "DT_ReportSemester_classSchoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "DT_ReportSemester" DROP CONSTRAINT "DT_ReportSemester_reportSemesterId_fkey";

-- DropForeignKey
ALTER TABLE "DT_ReportSubject" DROP CONSTRAINT "DT_ReportSubject_classSchoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "DT_ReportSubject" DROP CONSTRAINT "DT_ReportSubject_reportSubjectId_fkey";

-- DropForeignKey
ALTER TABLE "DT_Result" DROP CONSTRAINT "DT_Result_scoreBoardId_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSemester" DROP CONSTRAINT "ReportSemester_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSemester" DROP CONSTRAINT "ReportSemester_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSubject" DROP CONSTRAINT "ReportSubject_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSubject" DROP CONSTRAINT "ReportSubject_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSubject" DROP CONSTRAINT "ReportSubject_subjectId_fkey";

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_scoreBoardId_studentId_fkey" FOREIGN KEY ("scoreBoardId", "studentId") REFERENCES "DT_ScoreBoard"("scoreBoardId", "studentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSubject" ADD CONSTRAINT "ReportSubject_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSubject" ADD CONSTRAINT "ReportSubject_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSubject" ADD CONSTRAINT "ReportSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ReportSubject" ADD CONSTRAINT "DT_ReportSubject_reportSubjectId_fkey" FOREIGN KEY ("reportSubjectId") REFERENCES "ReportSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ReportSubject" ADD CONSTRAINT "DT_ReportSubject_classSchoolYearId_fkey" FOREIGN KEY ("classSchoolYearId") REFERENCES "ClassSchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSemester" ADD CONSTRAINT "ReportSemester_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSemester" ADD CONSTRAINT "ReportSemester_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ReportSemester" ADD CONSTRAINT "DT_ReportSemester_reportSemesterId_fkey" FOREIGN KEY ("reportSemesterId") REFERENCES "ReportSemester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ReportSemester" ADD CONSTRAINT "DT_ReportSemester_classSchoolYearId_fkey" FOREIGN KEY ("classSchoolYearId") REFERENCES "ClassSchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
