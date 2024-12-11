import prisma from "../client.js";

export const getAllTeachers = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
  const p = page ? parseInt(page) : 1;
  const pItems = pageItems ? parseInt(pageItems) : 10;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "classId":
          query.lessons = {
            some: {
              classId: parseInt(value),
            },
          };
          break;
        case "teacherId":
          query.id = value;
          break;
        case "search":
          query.lastName = {
            contains: value,
            mode: "insensitive",
          };
        default:
          break;
      }
    }
  }

  try {
    const [teachers, count] = await prisma.$transaction([
      prisma.teacher.findMany({
        where: query,
        include: {
          class: true,
          subjects: true,
          lessons: {
            include: {
              class: true,
            },
          },
        },
        take: pItems,
        skip: pItems * (p - 1),
      }),
      prisma.teacher.count({
        where: query,
      }),
    ]);
    res.status(200).json({ teachers, totalCount: count });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await prisma.teacher.findFirst({
      where: {
        id: teacherId,
      },
    });
    res.status(200).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
