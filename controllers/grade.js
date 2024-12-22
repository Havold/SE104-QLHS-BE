export const getAllGrades = async (req, res) => {
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
    const count = await prisma.grade.count({ where: query });
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }
    const grades = await prisma.grade.findMany({
      where: query,
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res.status(200).json({ grades, totalCount: count, currentPage: p });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
