import prisma from "../client.js";
import jwt from "jsonwebtoken";

export const getAllScoreBoard = async (req, res) => {
  const { page, pageItems, type, ...queryParams } = req.query;
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
    const count = await prisma.scoreBoard.count({ where: query });

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let scoreBoards;
    if (type === "all") {
      scoreBoards = await prisma.scoreBoard.findMany({
        where: query,
        orderBy: {
          ["id"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res.status(200).json({ scoreBoards, totalCount: count, currentPage: 1 });
      return;
    }

    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    scoreBoards = await prisma.scoreBoard.findMany({
      where: query,
      include: {
        schoolYear: true,
        semester: true,
        subject: true,
        typeOfExam: true,
      },
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res.status(200).json({ scoreBoards, totalCount: count, currentPage: p });
  } catch (error) {
    console.log("Error fetching Score boards data: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const getScoreBoard = async (req, res) => {
  const scoreBoardId = parseInt(req.params.id);
  try {
    const scoreBoard = await prisma.scoreBoard.findFirst({
      where: {
        id: scoreBoardId,
      },
      include: {
        schoolYear: true,
        semester: true,
        subject: true,
        typeOfExam: true,
        dtScoreBoards: {
          include: {
            student: true,
          },
        },
      },
    });

    res.status(200).json(scoreBoard);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const addScoreBoard = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN!");
    }

    const subjectId = parseInt(req.body.subjectId);
    const schoolYearId = parseInt(req.body.schoolYearId);
    const semesterId = parseInt(req.body.semesterId);
    const typeOfExamId = parseInt(req.body.typeOfExamId);

    console.log(typeOfExamId);

    const existingScoreBoard = await prisma.scoreBoard.findFirst({
      where: {
        subjectId: subjectId,
        schoolYearId: schoolYearId,
        semesterId: semesterId,
        typeOfExamId,
      },
    });

    if (existingScoreBoard) {
      return res.status(403).json("This score board has been created!!");
    }

    await prisma.scoreBoard.create({
      data: {
        subject: {
          connect: {
            id: subjectId,
          },
        },

        schoolYear: {
          connect: {
            id: schoolYearId,
          },
        },

        semester: {
          connect: {
            id: semesterId,
          },
        },

        typeOfExam: {
          connect: {
            id: typeOfExamId,
          },
        },
      },
    });

    return res.status(200).json("New score board has been created!");
  });
};

export const deleteScoreBoard = (req, res) => {};
export const updateScoreBoard = (req, res) => {};

export const getStudentsWithoutScoreInBoard = async (req, res) => {
  const { page, subPage, pageItems, type, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let subP = subPage ? parseInt(subPage) : 1;
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
    if (subP) {
      p = subP;
    }
    const scoreBoardId = parseInt(req.params.id);
    const count = await prisma.student.count({
      where: {
        NOT: {
          DT_scoreBoards: {
            some: {
              scoreBoardId: scoreBoardId,
            },
          },
        },
      },
    });

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    // let scoreBoards;
    // if (type === "all") {
    //   scoreBoards = await prisma.scoreBoard.findMany({
    //     where: query,
    //     orderBy: {
    //       ["id"]: "asc", // Sắp xếp theo trường và thứ tự
    //     },
    //   });
    //   res.status(200).json({ scoreBoards, totalCount: count, currentPage: 1 });
    //   return;
    // }

    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    const studentsWithoutScoreInBoard1 = await prisma.student.findMany({
      where: {
        NOT: {
          DT_scoreBoards: {
            some: {
              scoreBoardId: scoreBoardId,
            },
          },
        },
      },
      skip: (p - 1) * pItems,
      take: pItems,
    });
    res.status(200).json({
      result: studentsWithoutScoreInBoard1,
      totalCount: count,
      currentPage: p,
    });
  } catch (error) {
    console.log("Error fetching Score boards data: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};
