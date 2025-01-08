import prisma from "../client.js";
import jwt from "jsonwebtoken";

export const getAllSemesterReports = async (req, res) => {
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
    const count = await prisma.reportSemester.count({ where: query });

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let semesterReports;
    if (type === "all") {
      semesterReports = await prisma.reportSemester.findMany({
        where: query,
        orderBy: {
          ["id"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res
        .status(200)
        .json({ semesterReports, totalCount: count, currentPage: 1 });
      return;
    }

    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    semesterReports = await prisma.reportSemester.findMany({
      where: query,
      include: {
        schoolYear: true,
        semester: true,
      },
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res
      .status(200)
      .json({ semesterReports, totalCount: count, currentPage: p });
  } catch (error) {
    console.log("Error fetching Semester Reports data: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

// export const createSubjectReport = (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) {
//     return res.status(401).json("YOU ARE NOT LOGIN!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
//     if (err) {
//       res.status(403).json("INVALID TOKEN!");
//     }

//     const subjectId = parseInt(req.body.subjectId);
//     const schoolYearId = parseInt(req.body.schoolYearId);
//     const semesterId = parseInt(req.body.semesterId);

//     const existingReport = await prisma.reportSubject.findFirst({
//       where: {
//         subjectId,
//         schoolYearId,
//         semesterId,
//       },
//     });

//     if (existingReport) {
//       return res.status(403).json("This report has been created!!");
//     }

//     await prisma.reportSubject.create({
//       data: {
//         subject: {
//           connect: {
//             id: subjectId,
//           },
//         },

//         schoolYear: {
//           connect: {
//             id: schoolYearId,
//           },
//         },

//         semester: {
//           connect: {
//             id: semesterId,
//           },
//         },
//       },
//     });

//     return res.status(200).json("New report has been created!");
//   });
// };

export const createSemesterReport = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const { schoolYearId, semesterId } = req.body;

    try {
      // Kiểm tra nếu báo cáo đã tồn tại
      const existingReport = await prisma.reportSemester.findFirst({
        where: {
          schoolYearId: parseInt(schoolYearId),
          semesterId: parseInt(semesterId),
        },
      });

      if (existingReport) {
        return res.status(403).json("This report already exists!");
      }

      // Tạo báo cáo mới trong bảng ReportSubject
      const newReport = await prisma.reportSemester.create({
        data: {
          schoolYearId: parseInt(schoolYearId),
          semesterId: parseInt(semesterId),
        },
      });

      // Lấy danh sách ScoreBoard thuộc SchoolYear và Semester
      //   const scoreBoards = await prisma.scoreBoard.findMany({
      //     where: {
      //       schoolYearId: parseInt(schoolYearId),
      //       semesterId: parseInt(semesterId),
      //       subjectId: parseInt(subjectId),
      //     },
      //     include: {
      //       dtScoreBoards: true, // Để lấy danh sách điểm số cho từng học sinh
      //     },
      //   });

      //   const reportData = scoreBoards.map((scoreBoard) => {
      //     const scores = scoreBoard.dtScoreBoards;

      //     // Tổng số học sinh trong lớp
      //     const totalStudents = scores.length;

      //     // Số lượng học sinh đạt (score >= 5.0)
      //     const numberPassed = scores.filter(
      //       (s) => s.score && s.score >= 5.0
      //     ).length;

      //     // Tỷ lệ đạt
      //     const percentagePassed =
      //       totalStudents > 0 ? (numberPassed / totalStudents) * 100 : 0;

      //     return {
      //       classSchoolYearId: scoreBoard.classId, // Thay đổi nếu cần để lưu ID lớp
      //       capacity: totalStudents,
      //       numberPassed,
      //       percentagePassed,
      //     };
      //   });

      //   // Tạo dữ liệu DT_ReportSubject
      //   await Promise.all(
      //     reportData.map(async (data) => {
      //       await prisma.dT_ReportSubject.create({
      //         data: {
      //           capacity: data.capacity,
      //           numberPassed: data.numberPassed,
      //           percentage: data.percentagePassed,
      //           reportSubjectId: newReport.id,
      //           classSchoolYearId: data.classSchoolYearId,
      //         },
      //       });
      //     })
      //   );

      return res
        .status(200)
        .json("Report created and data generated successfully!");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json("An error occurred while creating the report.");
    }
  });
};

export const deleteSemesterReport = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const semesterReport = parseInt(req.params.id);

    await prisma.reportSemester.delete({
      where: {
        id: semesterReport,
      },
    });

    return res.status(200).json("This report has been deleted!");
  });
};
