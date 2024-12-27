import prisma from "../client.js";
import jwt from "jsonwebtoken";

// GET ALL TYPES OF EXAM
export const getAllTypesOfExam = async (req, res) => {
  const { page, type, pageItems, ...queryParams } = req.query;
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
    const count = await prisma.typeOfExam.count({ where: query });
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let typesOfExam;
    if (type === "all") {
      typesOfExam = await prisma.typeOfExam.findMany({
        where: query,
        orderBy: {
          ["id"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res.status(200).json({ typesOfExam, totalCount: count, currentPage: 1 });
      return;
    }

    if (p <= 0) {
      p = 1;
    }
    typesOfExam = await prisma.typeOfExam.findMany({
      where: query,
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res.status(200).json({ typesOfExam, totalCount: count, currentPage: p });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
