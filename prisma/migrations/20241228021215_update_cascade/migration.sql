-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ScoreBoard" DROP CONSTRAINT "ScoreBoard_classId_fkey";

-- DropForeignKey
ALTER TABLE "ScoreBoard" DROP CONSTRAINT "ScoreBoard_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "ScoreBoard" DROP CONSTRAINT "ScoreBoard_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "ScoreBoard" DROP CONSTRAINT "ScoreBoard_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ScoreBoard" DROP CONSTRAINT "ScoreBoard_typeOfExamId_fkey";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreBoard" ADD CONSTRAINT "ScoreBoard_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreBoard" ADD CONSTRAINT "ScoreBoard_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreBoard" ADD CONSTRAINT "ScoreBoard_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreBoard" ADD CONSTRAINT "ScoreBoard_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreBoard" ADD CONSTRAINT "ScoreBoard_typeOfExamId_fkey" FOREIGN KEY ("typeOfExamId") REFERENCES "TypeOfExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
