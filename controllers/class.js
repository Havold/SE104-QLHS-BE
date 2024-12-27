import prisma from "../client.js";
import jwt from "jsonwebtoken";

// GET ALL CLASSES
export const getAllClasses = async (req, res) => {
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
    const count = await prisma.class.count({ where: query });

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let classes;
    if (type === "all") {
      const schoolYearId = req.query.schoolYearId;
      if (schoolYearId) {
        query.classSchoolYear = {
          some: {
            schoolYearId: parseInt(schoolYearId),
          },
        };
      }
      classes = await prisma.class.findMany({
        where: query,
        orderBy: {
          ["name"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res.status(200).json({ classes, totalCount: count, currentPage: 1 });
      return;
    }

    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    classes = await prisma.class.findMany({
      where: query,
      select: {
        id: true,
        name: true,
        grade: {
          select: {
            id: true,
            level: true,
          },
        },
      },
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res.status(200).json({ classes, totalCount: count, currentPage: p });
  } catch (error) {
    console.log("Error fetching Classes data: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

// GET A CLASS
export const getClass = async (req, res) => {
  const classId = parseInt(req.params.id);
  try {
    const _class = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      select: {
        name: true,
        grade: {
          select: {
            level: true,
          },
        },
      },
    });

    res.status(200).json(_class);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// ADD CLASS
export const addClass = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN!");
    }
    const gradeId = req.body.grade ? parseInt(req.body.grade) : 1;
    const grade = await prisma.grade.findUnique({
      select: {
        level: true,
      },
      where: {
        id: gradeId,
      },
    });

    const name = grade.level + req.body.name;
    const existingClass = await prisma.class.findFirst({
      where: {
        name: name,
      },
    });

    if (existingClass) {
      return res.status(403).json("This class already exists!");
    }

    await prisma.class.create({
      data: {
        name: name,
        grade: {
          connect: {
            id: gradeId,
          },
        },
      },
    });

    return res.status(200).json("New class has been added!");
  });
};

// DELETE CLASS
export const deleteClass = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const classId = parseInt(req.params.id);

    const cs = await prisma.class.findFirst({
      select: {
        name: true,
      },
      where: {
        id: classId,
      },
    });

    await prisma.class.delete({
      where: {
        id: classId,
      },
    });

    return res.status(200).json(`${cs.name} has been deleted!`);
  });
};

// UPDATE CLASS
export const updateClass = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN");
    }

    const gradeId = req.body.grade ? parseInt(req.body.grade) : 1;
    const grade = await prisma.grade.findUnique({
      select: {
        level: true,
      },
      where: {
        id: gradeId,
      },
    });

    const name = grade.level + req.body.name;
    const existingClass = await prisma.class.findFirst({
      where: {
        name: name,
      },
    });

    if (existingClass) {
      return res.status(403).json("This class already exists!");
    }

    const classId = parseInt(req.params.id);

    await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        name: name,
        grade: {
          connect: {
            id: gradeId,
          },
        },
      },
    });

    return res.status(200).json("Updated class successfully!");
  });
};
