// prisma/seed.ts
import { PrismaClient, Sex } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Authorities
  await prisma.authority.createMany({
    data: [
      {
        name: "Create",
      },
      { name: "View" },
      { name: "Update" },
      { name: "Delete" },
    ],
  });

  const allAuthorities = await prisma.authority.findMany();

  // Seed Role
  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      authorities: {
        connect: allAuthorities.map((auth) => ({ id: auth.id })),
      },
    },
  });

  const teacherRole = await prisma.role.create({
    data: {
      name: "Teacher",
      authorities: {
        connect: allAuthorities.map((auth) => ({ id: auth.id })),
      },
    },
  });

  const studentRole = await prisma.role.create({
    data: {
      name: "Student",
    },
  });

  // Seed Admin
  await prisma.admin.createMany({
    data: [
      {
        id: "admin1",
        username: "admin_user",
        email: "admin@example.com",
        password: "securepassword",
      },
    ],
  });

  // Seed Grades
  const grades = await prisma.grade.createMany({
    data: [{ level: 10 }, { level: 11 }, { level: 12 }],
  });

  // Seed Subjects
  const subjects = await prisma.subject.createMany({
    data: [
      { name: "Math" },
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Biology" },
      { name: "English" },
      { name: "History" },
    ],
  });

  // Seed Semesters
  const semesters = await prisma.semester.createMany({
    data: [{ name: "Semester 1" }, { name: "Semester 2" }],
  });

  // Seed SchoolYears
  const schoolYears = await prisma.schoolYear.createMany({
    data: [{ value: 2023 }, { value: 2024 }],
  });

  // Seed Classes
  const grade10 = await prisma.grade.findFirst({ where: { level: 10 } });
  const classes = await prisma.class.createMany({
    data: [
      { name: "10A1", gradeId: grade10?.id ?? 1 },
      { name: "10A2", gradeId: grade10?.id ?? 1 },
    ],
  });

  // Seed Students
  for (let i = 1; i <= 10; i++) {
    await prisma.student.create({
      data: {
        username: `student${i}`,
        email: `student${i}@example.com`,
        phone: `12345679${i}`,
        password: "password123",
        fullName: `Student ${i}`,
        address: `${i}, ABC Street, Vietnam.`,
        sex: i % 2 === 0 ? Sex.Male : Sex.Female,
        birth: new Date("2007-01-01"),
        roleId: i !== 1 ? studentRole.id : teacherRole.id,
      },
    });
  }

  // Seed ClassSchoolYear
  const schoolYear2023 = await prisma.schoolYear.findFirst({
    where: { value: 2023 },
  });
  const class10A1 = await prisma.class.findFirst({ where: { name: "10A1" } });
  const classSchoolYear = await prisma.classSchoolYear.create({
    data: {
      schoolYearId: schoolYear2023?.id ?? 1,
      classId: class10A1?.id ?? 1,
      capacity: 30,
    },
  });

  const class10A2Updated = await prisma.class.findFirst({
    where: { name: "10A2" },
  });
  await prisma.classSchoolYear.create({
    data: {
      schoolYearId: schoolYear2023?.id ?? 1,
      classId: class10A2Updated?.id ?? 1,
      capacity: 28, // Sĩ số của lớp 10A2
    },
  });

  const schoolYear2024 = await prisma.schoolYear.findFirst({
    where: { value: 2024 },
  });
  const class10A1_2 = await prisma.class.findFirst({ where: { name: "10A1" } });
  const classSchoolYear_2024 = await prisma.classSchoolYear.create({
    data: {
      schoolYearId: schoolYear2024?.id ?? 1,
      classId: class10A1_2?.id ?? 1,
      capacity: 30,
    },
  });

  // Seed StudentClass
  for (let i = 1; i <= 10; i++) {
    let student = await prisma.student.findFirst({
      where: { username: `student${i}` },
    });

    await prisma.studentClass.create({
      data: {
        studentId: student?.id ?? 1,
        classSchoolYearId: classSchoolYear.id,
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    let student = await prisma.student.findFirst({
      where: { username: `student${i}` },
    });

    await prisma.studentClass.create({
      data: {
        studentId: student?.id ?? 1,
        classSchoolYearId: classSchoolYear_2024.id,
      },
    });
  }

  // Get information of `student1`
  const student1 = await prisma.student.findFirst({
    where: { username: "student1" },
  });

  // Seed TypeOfExam
  await prisma.typeOfExam.createMany({
    data: [
      {
        name: "15",
      },
      {
        name: "45",
      },
    ],
  });

  // Seed ScoreBoard
  // const subjectMath = await prisma.subject.findFirst({
  //   where: { name: "Math" },
  // });
  // const semester1 = await prisma.semester.findFirst({
  //   where: { name: "Semester 1" },
  // });
  // const typeOfExam = await prisma.typeOfExam.findFirst(); // Giả định có dữ liệu trong bảng TypeOfExam

  // const scoreBoard = await prisma.scoreBoard.create({
  //   data: {
  //     schoolYearId: schoolYear2023?.id ?? 1,
  //     semesterId: semester1?.id ?? 1,
  //     subjectId: subjectMath?.id ?? 1,
  //     typeOfExamId: typeOfExam?.id ?? 1,
  //   },
  // });

  // // Seed DT_ScoreBoard

  // const dtScoreBoard = await prisma.dT_ScoreBoard.create({
  //   data: {
  //     score: 7.8,
  //     scoreBoardId: scoreBoard.id,
  //     studentId: student1?.id ?? 1,
  //   },
  // });

  // Seed Results
  // const result = await prisma.result.create({
  //   data: {
  //     avgSemI: 7.5,
  //     avgSemII: 8.0,
  //     schoolYearId: schoolYear2023?.id ?? 1,
  //     studentId: student1?.id ?? 1,
  //   },
  // });

  // // Seed DT_Result

  // const dtResult = await prisma.dT_Result.create({
  //   data: {
  //     avgScore: 8.0,
  //     resultId: result.id,
  //     subjectId: subjectMath?.id ?? 1,
  //     scoreBoardId: 1, // Assuming a DT_ScoreBoard with ID exists
  //     studentId: student1?.id ?? 1,
  //   },
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
