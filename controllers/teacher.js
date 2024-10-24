import prisma from "../client.js";

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        class: true,
        subjects: true,
        lessons: {
          include: {
            class: true,
          },
        },
      },
    });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json(error);
  }
};
