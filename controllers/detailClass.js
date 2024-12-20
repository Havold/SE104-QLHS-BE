import prisma from "../client.js";

export const getAllDetailClasses = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
  const p = page ? parseInt(page) : 1;
  const pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
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
    const [classes, count] = await prisma.$transaction([
      prisma.classSchoolYear.findMany({
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
      }),
      prisma.classSchoolYear.count({ where: query }),
    ]);

    // Xử lý kết quả trả về
    const results = classes.map((cs) => ({
      id: cs.class.id,
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
