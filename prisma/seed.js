// prisma/seed.ts
import { PrismaClient, Sex } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
    },
  });

  // Seed StudentClass
  const student1 = await prisma.student.findFirst({
    where: { username: "student1" },
  });
  await prisma.studentClass.create({
    data: {
      capacity: 30,
      studentId: student1?.id ?? 1,
      classSchoolYearId: classSchoolYear.id,
    },
  });
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
