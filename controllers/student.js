import prisma from "../client.js";

export const getAllStudents = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
  const p = page ? parseInt(page) : 1;
  const pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  console.log(queryParams);
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "search":
          console.log("HELLO");

          query.fullName = {
            contains: value,
            mode: "insensitive",
          };
          break;
        default:
          break;
      }
    }
  }

  try {
    const [students, count] = await prisma.$transaction([
      prisma.student.findMany({
        where: query,
        include: {
          studentClasses: {
            include: {
              classSchoolYear: {
                include: {
                  schoolYear: true,
                  class: {
                    include: {
                      grade: true,
                    },
                  },
                },
              },
            },
          },
        },
        take: pItems,
        skip: (p - 1) * pItems,
      }),
      prisma.student.count({
        where: query,
      }),
    ]);
    res.status(200).json({ students, totalCount: count });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getStudent = async (req, res) => {
  const studentId = parseInt(req.params.id);
  try {
    const student = await prisma.student.findFirst({
      include: {
        studentClasses: {
          include: {
            classSchoolYear: {
              include: {
                schoolYear: true,
                class: {
                  include: {
                    grade: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: studentId,
      },
    });
    res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
