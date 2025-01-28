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
        case "schoolYearId":
          if (value != "") {
            query.schoolYear = {
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

      const classesSchoolYear = await prisma.classSchoolYear.findMany({
        where: {
          schoolYearId: parseInt(schoolYearId),
        },
        include: {
          studentsClass: true,
        },
      });

      console.log(classesSchoolYear);

      // Duyệt qua từng lớp học để tạo dữ liệu báo cáo
      const reportData = await Promise.all(
        classesSchoolYear.map(async (cs) => {
          const studentIds = cs.studentsClass.map((sc) => sc.studentId);

          // Tính điểm trung bình cho từng học sinh trong lớp
          const avgScores = await prisma.result.findMany({
            where: {
              studentId: {
                in: studentIds,
              },
              schoolYearId: schoolYearId,
            },
          });

          // Tính số học sinh đạt
          const numberPassed = avgScores.reduce((total, avgScoreObj) => {
            if (
              (semesterId == 1 && avgScoreObj.avgSemI >= 5) ||
              (semesterId == 2 && avgScoreObj.avgSemII >= 5)
            ) {
              total++;
            }
            return total;
          }, 0);

          // Tính phần trăm học sinh đạt
          return {
            classSchoolYearId: cs.id,
            capacity: cs.capacity,
            numberPassed: numberPassed,
            percentagePassed:
              cs.capacity > 0
                ? parseFloat(((numberPassed / cs.capacity) * 100).toFixed(2))
                : 0,
          };
        })
      );

      await Promise.all(
        reportData.map(async (data) => {
          await prisma.dT_ReportSemester.create({
            data: {
              capacity: data.capacity,
              numberPassed: data.numberPassed,
              percentage: data.percentagePassed,
              reportSemesterId: newReport.id,
              classSchoolYearId: data.classSchoolYearId,
            },
          });
        })
      );

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
