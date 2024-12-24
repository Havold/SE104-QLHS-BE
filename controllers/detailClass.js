import prisma from "../client.js";
import jwt from "jsonwebtoken";

export const getAllDetailClasses = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "schoolYear":
          query.classSchoolYear = {
            where: {
              schoolYearId: parseInt(value), // Chuyển sang số nguyên
            },
          };
        case "search":
          if (!query.class) query.class = {};
          query.class.name = {
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
    const count = await prisma.classSchoolYear.count({ where: query });
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    const classes = await prisma.classSchoolYear.findMany({
      where: query,
      skip: (p - 1) * pItems,
      take: pItems,
      include: {
        schoolYear: true,
        studentsClasses: {
          include: {
            student: true,
          },
        },
        class: {
          include: {
            grade: true,
          },
        },
      },
    });

    // Xử lý kết quả trả về
    const results = classes.map((cs) => ({
      id: cs.id,
      classId: cs.class.id,
      name: cs.class.name,
      gradeLevel: cs.class.grade.level,
      schoolYearId: cs.schoolYearId,
      schoolYearValue: cs.schoolYear.value,
      capacity: cs.capacity,
      students: cs.studentsClasses.map((sc) => ({
        id: sc.student.id,
        username: sc.student.username,
        email: sc.student.email,
        fullName: sc.student.fullName,
        sex: sc.student.sex,
        birth: sc.student.birth,
        address: sc.student.address,
      })),
    }));

    // Trả về dữ liệu phân trang
    res.status(200).json({
      classes: results,
      totalCount: count,
      currentPage: p,
    });
  } catch (error) {
    console.error("Error fetching classSchoolYear data:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getDetailClass = async (req, res) => {
  const { ...queryParams } = req.query;
  const classSchoolYearId = parseInt(req.params.id);
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        // case "schoolYear":
        //   query.classSchoolYear = {
        //     where: {
        //       schoolYearId: parseInt(value), // Chuyển sang số nguyên
        //     },
        //   };
        case "search":
          if (!query.class) query.class = {};
          query.class.name = {
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
    const cs = await prisma.classSchoolYear.findUnique({
      where: {
        id: classSchoolYearId,
      },
      include: {
        schoolYear: true,
        studentsClasses: {
          include: {
            student: true,
          },
        },
        class: {
          include: {
            grade: true,
          },
        },
      },
    });

    // Xử lý kết quả trả về
    const result = {
      id: cs.id,
      classId: cs.class.id,
      name: cs.class.name,
      gradeLevel: cs.class.grade.level,
      schoolYearId: cs.schoolYearId,
      schoolYearValue: cs.schoolYear.value,
      capacity: cs.capacity,
      students: cs.studentsClasses.map((sc) => ({
        id: sc.student.id,
        username: sc.student.username,
        email: sc.student.email,
        fullName: sc.student.fullName,
        sex: sc.student.sex,
        birth: sc.student.birth,
        address: sc.student.address,
      })),
    };

    // Trả về dữ liệu phân trang
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching classSchoolYear data:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ADD A DETAIL CLASS SCHOOL YEAR
export const addDetailClass = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN!");
    }

    const classId = parseInt(req.body.classId);
    const schoolYearId = parseInt(req.body.schoolYearId);

    const existingClass = await prisma.classSchoolYear.findFirst({
      where: {
        classId: classId,
        schoolYearId: schoolYearId,
      },
    });

    if (existingClass) {
      return res
        .status(403)
        .json("This class has been added for this school year!");
    }

    await prisma.classSchoolYear.create({
      data: {
        class: {
          connect: {
            id: classId,
          },
        },

        schoolYear: {
          connect: {
            id: schoolYearId,
          },
        },
      },
    });

    return res
      .status(200)
      .json("New class has been added for this school year!");
  });
};

// DELETE A DETAIL CLASS SCHOOL YEAR
export const deleteDetailClass = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const classSchoolYearId = parseInt(req.params.id);

    const classSchoolYear = await prisma.classSchoolYear.findFirst({
      select: {
        class: {
          select: {
            name: true,
          },
        },
        schoolYear: {
          select: {
            value: true,
          },
        },
      },
      where: {
        id: classSchoolYearId,
      },
    });

    await prisma.classSchoolYear.delete({
      where: {
        id: classSchoolYearId,
      },
    });

    return res
      .status(200)
      .json(
        `${classSchoolYear.class.name} has been remove from ${classSchoolYear.schoolYear.value}`
      );
  });
};

// UPDATE DETAIL CLASS
export const updateDetailClass = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN");
    }

    const classId = parseInt(req.body.classId);
    const schoolYearId = parseInt(req.body.schoolYearId);

    const existingClass = await prisma.classSchoolYear.findFirst({
      where: {
        classId: classId,
        schoolYearId: schoolYearId,
      },
    });

    if (existingClass) {
      return res
        .status(403)
        .json("This class has been added for this school year!");
    }

    await prisma.classSchoolYear.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        class: {
          connect: {
            id: classId,
          },
        },

        schoolYear: {
          connect: {
            id: schoolYearId,
          },
        },
      },
    });

    return res.status(200).json("Updated this class successfully!");
  });
};
