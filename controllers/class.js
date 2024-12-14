import prisma from "../client.js";

export const getAllClasses = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "search":
          query.name = {
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
    const [classes, count] = await prisma.$transaction([
      prisma.class.findMany({
        where: query,
        select: {
          name: true,
          grade: {
            select: {
              level: true,
            },
          },
        },
        take: pItems,
        skip: (p - 1) * pItems,
      }),
      prisma.class.count(),
    ]);
    res.status(200).json({ classes, totalCount: count });
  } catch (error) {
    console.log("Error fetching Classes data: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const getClass = async (req, res) => {
  const classId = parseInt(req.params.id);
  try {
    const _class = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      select: {
        name: true,
        grade: {
          select: {
            level: true,
          },
        },
      },
    });

    res.status(200).json(_class);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
