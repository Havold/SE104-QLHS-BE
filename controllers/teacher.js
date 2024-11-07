import prisma from "../client.js";

export const getAllTeachers = async (req, res) => {
  const PAGE_ITEMS = parseInt(req.query.pageItems) || 10;
  const CURRENT_PAGE = parseInt(req.query.page) || 1;
  try {
    const [teachers, count] = await prisma.$transaction([
      prisma.teacher.findMany({
        include: {
          class: true,
          subjects: true,
          lessons: {
            include: {
              class: true,
            },
          },
        },
        take: PAGE_ITEMS,
        skip: PAGE_ITEMS * (CURRENT_PAGE - 1),
      }),
      prisma.teacher.count(),
    ]);
    res.status(200).json({ teachers, totalCount: count });
  } catch (error) {
    res.status(500).json(error);
  }
};
