import prisma from "../client.js";

export const getAllStudents = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = req.query.pageItems
      ? parseInt(req.query.pageItems)
      : 5;
    const CURRENT_PAGE = req.query.page ? parseInt(req.query.page) : 1;
    const [students, count] = await prisma.$transaction([
      prisma.student.findMany({
        include: {
          grade: true,
          class: true,
        },
        take: ITEMS_PER_PAGE,
        skip: (CURRENT_PAGE - 1) * ITEMS_PER_PAGE,
      }),
      prisma.student.count(),
    ]);
    res.status(200).json({ students, totalCount: count });
  } catch (error) {
    res.status(500).json(error);
  }
};
