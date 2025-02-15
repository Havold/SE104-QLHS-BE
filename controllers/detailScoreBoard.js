import prisma from "../client.js";
import jwt from "jsonwebtoken";

export const getDetailScoreBoard = async (req, res) => {
  const { page, pageItems, type, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = { scoreBoardId: parseInt(req.params.id) };
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
    const count = await prisma.dT_ScoreBoard.count({ where: query });
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }
    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let dT_ScoreBoards;
    if (type === "all") {
      dT_ScoreBoards = await prisma.dT_ScoreBoard.findMany({
        where: query,
        orderBy: {
          ["id"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res
        .status(200)
        .json({ dT_ScoreBoards, totalCount: count, currentPage: 1 });
      return;
    }

    if (p <= 0) {
      p = 1;
    }
    dT_ScoreBoards = await prisma.dT_ScoreBoard.findMany({
      where: query,
      take: pItems,
      skip: (p - 1) * pItems,
    });

    const studentIds = dT_ScoreBoards.map((dT_ScoreBoard) => {
      return dT_ScoreBoard.studentId;
    });

    res.status(200).json({ dT_ScoreBoards, totalCount: count, currentPage: p });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const addStudentsToDTScoreBoardFunction = async (
  scoreBoardId,
  studentIds
) => {
  try {
    // Kiểm tra bảng điểm có tồn tại không
    const scoreBoardExists = await prisma.scoreBoard.findUnique({
      where: {
        id: scoreBoardId,
      },
    });

    if (!scoreBoardExists) {
      return Promise.resolve();
    }

    // Thêm học sinh vào lớp học sử dụng connect
    const studentClassData = studentIds.map((studentId) => ({
      studentId: studentId, // Chỉ định studentId trực tiếp
      scoreBoardId: scoreBoardId, // Chỉ định scoreBoardId trực tiếp
    }));

    // Sử dụng createMany để thêm nhiều bản ghi vào bảng
    const addedStudents = await prisma.dT_ScoreBoard.createMany({
      data: studentClassData,
      skipDuplicates: true, // Bỏ qua nếu học sinh đã được thêm
    });
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve();
  }
};

export const addStudentsToDTScoreBoard = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    let { scoreBoardId, studentIds } = req.body;
    scoreBoardId = parseInt(scoreBoardId);

    try {
      // Kiểm tra bảng điểm có tồn tại không
      const scoreBoardExists = await prisma.scoreBoard.findUnique({
        where: {
          id: scoreBoardId,
        },
      });

      if (!scoreBoardExists) {
        return res.status(404).json("Score board not found!");
      }

      // Thêm học sinh vào lớp học sử dụng connect
      const studentClassData = studentIds.map((studentId) => ({
        studentId: studentId, // Chỉ định studentId trực tiếp
        scoreBoardId: scoreBoardId, // Chỉ định scoreBoardId trực tiếp
      }));

      // Sử dụng createMany để thêm nhiều bản ghi vào bảng
      const addedStudents = await prisma.dT_ScoreBoard.createMany({
        data: studentClassData,
        skipDuplicates: true, // Bỏ qua nếu học sinh đã được thêm
      });

      return res
        .status(200)
        .json("Students have been successfully added to the class!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Something went wrong!");
    }
  });
};

export const removeStudentFromDTScoreBoard = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    try {
      const scoreBoardId = parseInt(req.params.id);
      const studentId = parseInt(req.params.studentId);

      const existingScoreBoard = await prisma.scoreBoard.findUnique({
        where: {
          id: scoreBoardId,
        },
      });

      await prisma.dT_ScoreBoard.delete({
        where: {
          scoreBoardId_studentId: {
            scoreBoardId: scoreBoardId,
            studentId: studentId,
          },
        },
      });

      return res
        .status(200)
        .json("Students have been removed from this score board!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Something went wrong!");
    }
  });
};
