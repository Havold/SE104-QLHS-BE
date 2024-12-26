-- DropForeignKey
ALTER TABLE "ClassSchoolYear" DROP CONSTRAINT "ClassSchoolYear_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSchoolYear" DROP CONSTRAINT "ClassSchoolYear_schoolYearId_fkey";

-- AddForeignKey
ALTER TABLE "ClassSchoolYear" ADD CONSTRAINT "ClassSchoolYear_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSchoolYear" ADD CONSTRAINT "ClassSchoolYear_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
