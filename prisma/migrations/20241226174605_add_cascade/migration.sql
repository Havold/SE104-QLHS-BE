-- DropForeignKey
ALTER TABLE "StudentClass" DROP CONSTRAINT "StudentClass_classSchoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "StudentClass" DROP CONSTRAINT "StudentClass_studentId_fkey";

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_classSchoolYearId_fkey" FOREIGN KEY ("classSchoolYearId") REFERENCES "ClassSchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
