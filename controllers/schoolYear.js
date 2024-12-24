import prisma from "../client.js";
import jwt from "jsonwebtoken";

// GET ALL SCHOOL YEAR
export const getAllSchoolYears = async (req, res) => {
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
    const count = await prisma.schoolYear.count({ where: query });
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }
    const schoolYears = await prisma.schoolYear.findMany({
      where: query,
      take: pItems,
      skip: (p - 1) * pItems,
      orderBy: {
        ["value"]: "asc", // Sắp xếp theo trường và thứ tự
      },
    });
    res.status(200).json({ schoolYears, totalCount: count, currentPage: p });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
