import prisma from "../client.js";
import jwt from "jsonwebtoken";
import { addStudentsToDTScoreBoardFunction } from "./detailScoreBoard.js";

export const getAllScoreBoard = async (req, res) => {
  const { page, pageItems, type, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "studentId":
          query.dtScoreBoards = {
            some: {
              studentId: parseInt(value),
            },
          };
          break;
        case "schoolYearId":
          if (value != "") {
            query.schoolYear = {
              id: parseInt(value),
            };
          }
          break;
        case "subjectId":
          if (value != "") {
            query.subject = {
              id: parseInt(value),
            };
          }
          break;
        case "classId":
          if (value != "") {
            query.class = {
              id: parseInt(value),
            };
          }
          break;
        case "semesterId":
          if (value != "") {
            query.semester = {
              id: parseInt(value),
            };
          }
          break;
        case "typeOfExamId":
          if (value != "") {
            query.typeOfExam = {
              id: parseInt(value),
            };
          }
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
        dtScoreBoards: {
          include: {
            student: true,
          },
        },
      },
    });

    // const studentIds = scoreBoard.dtScoreBoards.map(
    //   (dtScoreBoard) => dtScoreBoard.studentId
    // );

    // const classSchoolYear = await prisma.classSchoolYear.findFirst({
    //   where: {
    //     classId: scoreBoard.classId,
    //     schoolYearId: scoreBoard.schoolYearId,
    //   },
    //   include: {
    //     studentsClass: true,
    //   },
    // });

    // const missingStudents = await prisma.studentClass.findMany({
    //   where: {
    //     classSchoolYearId: classSchoolYear.id,
    //     studentId: {
    //       notIn: studentIds,
    //     },
    //   },
    // });

    // console.log(missingStudents);

    // if (missingStudents.length > 0) {
    //   const missingStudentIds = missingStudents.map(
    //     (missingStudent) => missingStudent.studentId
    //   );

    // }

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

    if (
      !subjectId ||
      !schoolYearId ||
      !classId ||
      !semesterId ||
      !typeOfExamId
    ) {
      return res.status(500).json("Please select/fill in all fields!");
    }

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

      console.log(newScoreBoard);
      console.log(students);

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
    // Xác thực token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const scoreBoardId = parseInt(req.params.id);

    // Kiểm tra request body
    const { updatedScores } = req.body;
    if (!Array.isArray(updatedScores) || updatedScores.length === 0) {
      return res
        .status(400)
        .json("Invalid updates format! Must be a non-empty array.");
    }

    const invalidScore = updatedScores.find(
      (item) =>
        typeof item.score !== "number" ||
        item.score < 0 ||
        item.score > 10 ||
        !item.studentId
    );
    if (invalidScore) {
      return res.status(400).json("Invalid data format in updatedScores.");
    }

    // Lấy thông tin ScoreBoard hiện tại
    const scoreBoard = await prisma.scoreBoard.findFirst({
      where: { id: scoreBoardId },
    });

    if (!scoreBoard) {
      return res.status(404).json("ScoreBoard not found!");
    }

    const { schoolYearId, semesterId, subjectId } = scoreBoard;

    // Transaction để cập nhật điểm và tính toán lại
    await prisma.$transaction(async (prisma) => {
      // Cập nhật điểm trong bảng DT_ScoreBoard
      const updatePromises = updatedScores.map(({ studentId, score }) =>
        prisma.dT_ScoreBoard.update({
          where: {
            scoreBoardId_studentId: {
              scoreBoardId,
              studentId: parseInt(studentId),
            },
          },
          data: { score },
        })
      );
      await Promise.all(updatePromises);

      // Xử lý liên kết với bảng trung gian DT_ScoreBoard_Result
      for (const { studentId } of updatedScores) {
        // Lấy hoặc tạo DT_Result cho học sinh
        const dtResult = await prisma.dT_Result.upsert({
          where: {
            resultId_subjectId_studentId_semesterId: {
              resultId: `${studentId}_${schoolYearId}`,
              subjectId,
              studentId: parseInt(studentId),
              semesterId: parseInt(semesterId),
            },
          },
          update: {},
          create: {
            resultId: `${studentId}_${schoolYearId}`,
            subjectId,
            semesterId: parseInt(semesterId),
            studentId: parseInt(studentId),
            avgScore: 0, // Sẽ được cập nhật sau
          },
        });

        // Liên kết ScoreBoard và DT_Result qua bảng trung gian
        await prisma.dT_ScoreBoard_Result.upsert({
          where: {
            scoreBoardId_dtResultId: {
              scoreBoardId,
              dtResultId: dtResult.id,
            },
          },
          create: {
            scoreBoardId,
            dtResultId: dtResult.id,
          },
          update: {},
        });
      }

      // Cập nhật điểm trung bình môn (DT_Result.avgScore)
      for (const { studentId } of updatedScores) {
        const scores = await prisma.dT_ScoreBoard.findMany({
          where: {
            studentId: parseInt(studentId),
            scoreBoard: {
              subjectId,
              semesterId,
            },
          },
          select: {
            score: true,
            scoreBoard: {
              include: {
                typeOfExam: true,
              },
            },
          },
        });

        let denominator = scores.length;

        const avgScore =
          scores.reduce((sum, item) => {
            if (item.scoreBoard.typeOfExam.name == "45") {
              sum += item.score * 2;
              denominator++;
            } else {
              sum += item.score;
            }
            return sum;
          }, 0) / denominator;

        await prisma.dT_Result.update({
          where: {
            resultId_subjectId_studentId_semesterId: {
              resultId: `${studentId}_${schoolYearId}`,
              subjectId,
              studentId: parseInt(studentId),
              semesterId: parseInt(semesterId),
            },
          },
          data: { avgScore },
        });
      }

      // Cập nhật điểm trung bình học kỳ (Result.avgSemI hoặc avgSemII)
      const studentIds = updatedScores.map((item) => parseInt(item.studentId));
      for (const studentId of studentIds) {
        const avgScores = await prisma.dT_Result.findMany({
          where: {
            resultId: `${studentId}_${schoolYearId}`,
            semesterId: parseInt(semesterId),
          },
          select: { avgScore: true },
        });

        const semesterAvg =
          avgScores.reduce((sum, item) => sum + item.avgScore, 0) /
          avgScores.length;

        const updateField =
          semesterId === 1
            ? { avgSemI: semesterAvg }
            : { avgSemII: semesterAvg };

        await prisma.result.update({
          where: { id: `${studentId}_${schoolYearId}` },
          data: updateField,
        });
      }
    });

    return res
      .status(200)
      .json("All scores updated and averages recalculated for the semester!");
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
