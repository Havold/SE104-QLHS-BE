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
        class: true,
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
      return res.status(403).json("INVALID TOKEN!");
    }

    const subjectId = parseInt(req.body.subjectId);
    const schoolYearId = parseInt(req.body.schoolYearId);
    const classId = parseInt(req.body.classId);
    const semesterId = parseInt(req.body.semesterId);
    const typeOfExamId = parseInt(req.body.typeOfExamId);

    try {
      // Kiểm tra xem ScoreBoard đã tồn tại chưa
      const existingScoreBoard = await prisma.scoreBoard.findFirst({
        where: {
          subjectId,
          schoolYearId,
          semesterId,
          classId,
          typeOfExamId,
        },
      });

      if (existingScoreBoard) {
        return res.status(403).json("This score board has been created!!");
      }

      console.log(classId);
      // Tạo bản ghi ScoreBoard
      const newScoreBoard = await prisma.scoreBoard.create({
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
          class: {
            connect: {
              id: classId,
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

      // Lấy danh sách studentId từ classId
      const students = await prisma.studentClass.findMany({
        where: {
          classSchoolYear: {
            classId: classId,
          },
        },
        select: {
          studentId: true,
        },
      });

      if (students.length === 0) {
        return res
          .status(400)
          .json("No students found for the selected class.");
      }

      // Tạo các bản ghi DT_ScoreBoard
      const dtScoreBoards = students.map((student) => ({
        scoreBoardId: newScoreBoard.id,
        studentId: student.studentId,
        score: null, // Giá trị mặc định ban đầu
      }));

      await prisma.dT_ScoreBoard.createMany({
        data: dtScoreBoards,
      });

      return res
        .status(200)
        .json("New score board and DT_ScoreBoard have been created!");
    } catch (error) {
      console.error("Error creating ScoreBoard:", error.message);
      return res.status(500).json("Internal Server Error.");
    }
  });
};

export const deleteScoreBoard = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const scoreBoardId = parseInt(req.params.id);

    // const scoreBoard = await prisma.scoreBoard.findFirst({
    //   where: {
    //     id: scoreBoardId,
    //   },
    // });

    await prisma.scoreBoard.delete({
      where: {
        id: scoreBoardId,
      },
    });

    return res.status(200).json("This score board has been deleted!");
  });
};

export const updateScoreBoard = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN");
    }
    const subjectId = parseInt(req.body.subjectId);
    const schoolYearId = parseInt(req.body.schoolYearId);
    const semesterId = parseInt(req.body.semesterId);
    const typeOfExamId = parseInt(req.body.typeOfExamId);

    const existingScoreBoard = await prisma.scoreBoard.findFirst({
      where: {
        subjectId,
        schoolYearId,
        semesterId,
        typeOfExamId,
      },
    });

    if (existingScoreBoard) {
      return res
        .status(403)
        .json("This score board has been added for this school year!");
    }

    await prisma.scoreBoard.update({
      where: {
        id: parseInt(req.params.id),
      },
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

    return res.status(200).json("Updated this score board successfully!");
  });
};

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

export const updateStudentsScore = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  try {
    // Verify token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const scoreBoardId = parseInt(req.params.id);
    // Validate request body
    const { updatedScores } = req.body;
    if (!Array.isArray(updatedScores) || updatedScores.length === 0) {
      return res
        .status(400)
        .json("Invalid updates format! Must be a non-empty array.");
    }

    console.log(updatedScores);

    // Prepare update promises
    const updatePromises = updatedScores.map((updatedScore) => {
      let { studentId, score } = updatedScore;
      // Validate fields
      if (typeof score !== "number" || score < 0 || score > 10) {
        throw new Error("Invalid update data! Ensure all fields are correct.");
      }

      studentId = parseInt(studentId);
      return prisma.dT_ScoreBoard.update({
        where: {
          scoreBoardId_studentId: {
            scoreBoardId,
            studentId,
          },
        },
        data: {
          score,
        },
      });
    });

    // Execute all updates
    await Promise.all(updatePromises);

    const scoreBoard = await prisma.scoreBoard.findFirst({
      where: {
        id: scoreBoardId,
      },
    });
    // Tính toán và cập nhật điểm trung bình học kỳ cho từng học sinh
    const schoolYearId = scoreBoard.schoolYearId;
    const semesterId = scoreBoard.semesterId;

    // Cập nhật điểm trung bình cho học sinh
    await updateStudentAverageScores(schoolYearId, semesterId);

    return res.status(200).json("All scores updated successfully!");
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json("INVALID TOKEN!");
    }

    console.error("Error updating scores:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const updateStudentAverageScores = async (schoolYearId, semesterId) => {
  // Lấy danh sách tất cả học sinh
  const students = await prisma.student.findMany();

  for (const student of students) {
    // Lấy điểm của từng học sinh trong kỳ học và năm học
    const dtScores = await prisma.dT_ScoreBoard.findMany({
      where: {
        studentId: student.id,
        scoreBoard: {
          schoolYearId: schoolYearId,
          semesterId: semesterId,
        },
      },
      include: {
        scoreBoard: {
          include: {
            subject: true, // Lấy thông tin môn học
            typeOfExam: true, // Lấy thông tin hình thức kiểm tra
          },
        },
      },
    });

    let totalScore = 0;
    let totalSubjects = 0;

    for (const score of dtScores) {
      let weightedScore;

      // Kiểm tra loại kiểm tra để áp dụng công thức tính điểm đúng
      if (score.scoreBoard.typeOfExam.name === "45'") {
        // Nếu là loại kiểm tra 45', tính điểm = score * 2
        weightedScore = score.score * 2;
      } else {
        // Nếu không, chỉ sử dụng điểm như là
        weightedScore = score.score;
      }

      // Tính điểm trung bình môn
      totalScore += weightedScore;
      totalSubjects++;
    }

    // Tính điểm trung bình cho học kỳ
    const avgSemesterScore = totalSubjects > 0 ? totalScore / totalSubjects : 0;

    // Cập nhật điểm trung bình vào bảng Result
    // Tìm hoặc tạo bản ghi Result cho học sinh
    const existingResult = await prisma.result.findFirst({
      where: {
        studentId: student.id,
        schoolYearId,
      },
    });

    if (existingResult) {
      // Cập nhật bản ghi đã tồn tại
      await prisma.result.update({
        where: {
          id: existingResult.id, // Sử dụng id của bản ghi đã tồn tại
        },
        data: {
          avgSemI: semesterId === 1 ? avgSemesterScore : existingResult.avgSemI,
          avgSemII:
            semesterId === 2 ? avgSemesterScore : existingResult.avgSemII,
        },
      });
    } else {
      // Tạo mới bản ghi nếu chưa tồn tại
      await prisma.result.create({
        data: {
          studentId: student.id,
          schoolYearId: schoolYearId,
          avgSemI: semesterId === 1 ? avgSemesterScore : null,
          avgSemII: semesterId === 2 ? avgSemesterScore : null,
        },
      });
    }
  }
};
