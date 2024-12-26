import prisma from "../client.js";
import jwt from "jsonwebtoken";

// export const getAllGrades = async (req, res) => {
//   const { page, pageItems, ...queryParams } = req.query;
//   let p = page ? parseInt(page) : 1;
//   let pItems = pageItems ? parseInt(pageItems) : 5;
//   let query = {};
//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       switch (key) {
//         case "search":
//           query.level = parseInt(value);
//           break;
//         default:
//           break;
//       }
//     }
//   }

//   try {
//     const count = await prisma.grade.count({ where: query });
//     if (p * pItems > count) {
//       p = Math.ceil(count / pItems);
//     }

//     if (p <= 0) {
//       p = 1;
//     }
//     const grades = await prisma.grade.findMany({
//       where: query,
//       take: pItems,
//       skip: (p - 1) * pItems,
//       orderBy: {
//         ["level"]: "asc", // Sắp xếp theo trường và thứ tự
//       },
//     });
//     res.status(200).json({ grades, totalCount: count, currentPage: p });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

export const getAllGrades = async (req, res) => {
  const { page, pageItems, type, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "search":
          query.level = parseInt(value);
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

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let grades;
    if (type === "all") {
      grades = await prisma.grade.findMany({
        where: query,
        orderBy: {
          ["level"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res.status(200).json({ grades, totalCount: count, currentPage: 1 });
      return;
    }

    if (p <= 0) {
      p = 1;
    }
    grades = await prisma.grade.findMany({
      where: query,
      take: pItems,
      skip: (p - 1) * pItems,
      orderBy: {
        level: "asc", // Sắp xếp theo trường và thứ tự
      },
      include: {
        classes: true, // Bao gồm thông tin các lớp
      },
    });

    // Thêm thông tin tổng số lớp cho từng khối
    const gradesWithClassCount = grades.map((grade) => ({
      ...grade,
      totalClasses: grade.classes.length, // Tổng số lớp của từng khối
    }));

    res.status(200).json({
      grades: gradesWithClassCount,
      totalCount: count,
      currentPage: p,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// ADD A GRADE
export const addGrade = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const existingGrade = await prisma.grade.findUnique({
      where: {
        level: req.body.level,
      },
    });

    if (existingGrade) {
      return res.status(403).json("This grade already exists");
    }

    await prisma.grade.create({
      data: {
        level: req.body.level,
      },
    });
    return res.status(200).json("New grade has been added!");
  });
};

// UPDATE GRADE
export const updateGrade = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  try {
    // Verify token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    // Parse grade ID from params
    const gradeId = parseInt(req.params.id);
    if (isNaN(gradeId)) {
      return res.status(400).json("Invalid grade ID!");
    }

    // Find the existing grade
    const existingGrade = await prisma.grade.findUnique({
      where: {
        id: gradeId,
      },
    });

    if (!existingGrade) {
      return res.status(404).json("Grade not found!");
    }

    // Check for name updates
    const newLevel = req.body.level;
    if (newLevel && newLevel !== existingGrade.level) {
      // Check if new name already exists
      const levelCheck = await prisma.grade.findUnique({
        where: {
          level: newLevel,
        },
      });

      if (levelCheck) {
        return res.status(403).json("This grade already exists!");
      }

      // Update grade name
      await prisma.grade.update({
        where: {
          id: gradeId,
        },
        data: {
          level: req.body.level,
        },
      });

      return res.status(200).json("Grade updated successfully!");
    }

    // No changes detected
    return res
      .status(400)
      .json("No updates made. Grade name remains unchanged.");
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json("INVALID TOKEN!");
    }
    console.error("Error updating grade:", error);
    return res.status(500).json("Internal server error.");
  }
};

// DELETE GRADE
export const deleteGrade = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const gradeId = parseInt(req.params.id);

    const grade = await prisma.grade.findUnique({
      select: {
        level: true,
      },
      where: {
        id: gradeId,
      },
    });
    await prisma.grade.delete({
      where: {
        id: gradeId,
      },
    });
    return res.status(200).json(`${grade.level} has been deleted!`);
  });
};
