-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "ScheduleDay" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "img" TEXT,
    "fullName" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolYear" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOfExam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TypeOfExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreBoard" (
    "id" SERIAL NOT NULL,
    "schoolYearId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "typeOfExamId" INTEGER NOT NULL,

    CONSTRAINT "ScoreBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DT_ScoreBoard" (
    "score" DOUBLE PRECISION,
    "scoreBoardId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "DT_ScoreBoard_pkey" PRIMARY KEY ("scoreBoardId","studentId")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "avgSemI" DOUBLE PRECISION,
    "avgSemII" DOUBLE PRECISION,
    "schoolYearId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DT_Result" (
    "id" SERIAL NOT NULL,
    "avgScore" DOUBLE PRECISION NOT NULL,
    "resultId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,

    CONSTRAINT "DT_Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DT_ScoreBoard_Result" (
    "scoreBoardId" INTEGER NOT NULL,
    "dtResultId" INTEGER NOT NULL,

    CONSTRAINT "DT_ScoreBoard_Result_pkey" PRIMARY KEY ("scoreBoardId","dtResultId")
);

-- CreateTable
CREATE TABLE "ReportSubject" (
    "id" SERIAL NOT NULL,
    "schoolYearId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "ReportSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DT_ReportSubject" (
    "capacity" INTEGER NOT NULL,
    "numberPassed" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "reportSubjectId" INTEGER NOT NULL,
    "classSchoolYearId" INTEGER NOT NULL,

    CONSTRAINT "DT_ReportSubject_pkey" PRIMARY KEY ("reportSubjectId","classSchoolYearId")
);

-- CreateTable
CREATE TABLE "ReportSemester" (
    "id" SERIAL NOT NULL,
    "schoolYearId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,

    CONSTRAINT "ReportSemester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DT_ReportSemester" (
    "capacity" INTEGER NOT NULL,
    "numberPassed" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "reportSemesterId" INTEGER NOT NULL,
    "classSchoolYearId" INTEGER NOT NULL,

    CONSTRAINT "DT_ReportSemester_pkey" PRIMARY KEY ("reportSemesterId","classSchoolYearId")
);

-- CreateTable
CREATE TABLE "ClassSchoolYear" (
    "id" SERIAL NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "schoolYearId" INTEGER NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "ClassSchoolYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentClass" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classSchoolYearId" INTEGER NOT NULL,

    CONSTRAINT "StudentClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authority" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Authority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassSchoolYearToEvent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AnnouncementToClassSchoolYear" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AuthorityToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolYear_value_key" ON "SchoolYear"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_level_key" ON "Grade"("level");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DT_Result_resultId_subjectId_studentId_semesterId_key" ON "DT_Result"("resultId", "subjectId", "studentId", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Authority_name_key" ON "Authority"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassSchoolYearToEvent_AB_unique" ON "_ClassSchoolYearToEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassSchoolYearToEvent_B_index" ON "_ClassSchoolYearToEvent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnnouncementToClassSchoolYear_AB_unique" ON "_AnnouncementToClassSchoolYear"("A", "B");

-- CreateIndex
CREATE INDEX "_AnnouncementToClassSchoolYear_B_index" ON "_AnnouncementToClassSchoolYear"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorityToRole_AB_unique" ON "_AuthorityToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorityToRole_B_index" ON "_AuthorityToRole"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "DT_ScoreBoard" ADD CONSTRAINT "DT_ScoreBoard_scoreBoardId_fkey" FOREIGN KEY ("scoreBoardId") REFERENCES "ScoreBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ScoreBoard" ADD CONSTRAINT "DT_ScoreBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_Result" ADD CONSTRAINT "DT_Result_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ScoreBoard_Result" ADD CONSTRAINT "DT_ScoreBoard_Result_scoreBoardId_fkey" FOREIGN KEY ("scoreBoardId") REFERENCES "ScoreBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DT_ScoreBoard_Result" ADD CONSTRAINT "DT_ScoreBoard_Result_dtResultId_fkey" FOREIGN KEY ("dtResultId") REFERENCES "DT_Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "ClassSchoolYear" ADD CONSTRAINT "ClassSchoolYear_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSchoolYear" ADD CONSTRAINT "ClassSchoolYear_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClass" ADD CONSTRAINT "StudentClass_classSchoolYearId_fkey" FOREIGN KEY ("classSchoolYearId") REFERENCES "ClassSchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassSchoolYearToEvent" ADD CONSTRAINT "_ClassSchoolYearToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "ClassSchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassSchoolYearToEvent" ADD CONSTRAINT "_ClassSchoolYearToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToClassSchoolYear" ADD CONSTRAINT "_AnnouncementToClassSchoolYear_A_fkey" FOREIGN KEY ("A") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToClassSchoolYear" ADD CONSTRAINT "_AnnouncementToClassSchoolYear_B_fkey" FOREIGN KEY ("B") REFERENCES "ClassSchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorityToRole" ADD CONSTRAINT "_AuthorityToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Authority"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorityToRole" ADD CONSTRAINT "_AuthorityToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
