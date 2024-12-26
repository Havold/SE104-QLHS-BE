import prisma from "../client.js";
import jwt from "jsonwebtoken";

// GET STUDENTS FROM CLASS
export const getStudentsFromClass = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {
    classSchoolYearId: parseInt(req.params.id),
  };
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "search":
          query.student = {
            name: {
              contains: value,
              mode: "insensitive",
            },
          };
          break;
        default:
          break;
      }
    }
  }

  try {
    const count = await prisma.studentClass.count({ where: query });
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    const students = await prisma.studentClass.findMany({
      where: query,
      include: {
        student: true,
        classSchoolYear: true,
      },
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res.status(200).json({ students, totalCount: count, currentPage: p });
  } catch (error) {
    console.log("Error fetching Classes data: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const addStudentsToClass = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    let { classSchoolYearId, studentIds } = req.body;
    classSchoolYearId = parseInt(classSchoolYearId);

    try {
      // Kiểm tra lớp học có tồn tại không
      const classExists = await prisma.classSchoolYear.findUnique({
        where: {
          id: classSchoolYearId,
        },
      });

      if (!classExists) {
        return res.status(404).json("Class not found!");
      }

      // Thêm học sinh vào lớp học sử dụng connect
      const studentClassData = studentIds.map((studentId) => ({
        studentId: studentId, // Chỉ định studentId trực tiếp
        classSchoolYearId: classSchoolYearId, // Chỉ định classSchoolYearId trực tiếp
      }));

      // Sử dụng createMany để thêm nhiều bản ghi vào bảng StudentClass
      const addedStudents = await prisma.studentClass.createMany({
        data: studentClassData,
        skipDuplicates: true, // Bỏ qua nếu học sinh đã được thêm
      });

      // Cập nhật capacity
      const currentCapacity = classExists.capacity + studentIds.length;
      await prisma.classSchoolYear.update({
        where: { id: classSchoolYearId },
        data: { capacity: currentCapacity },
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

// Remove student from class
export const removeStudentsFromClass = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    try {
      const studentClassId = parseInt(req.params.id);

      const existingClass = await prisma.studentClass.findUnique({
        where: {
          id: studentClassId,
        },
        include: {
          classSchoolYear: true,
        },
      });

      await prisma.studentClass.delete({
        where: {
          id: studentClassId,
        },
      });

      // Cập nhật capacity
      const currentCapacity = existingClass.classSchoolYear.capacity - 1;
      await prisma.classSchoolYear.update({
        where: { id: existingClass.classSchoolYear.id },
        data: { capacity: currentCapacity },
      });

      return res
        .status(200)
        .json("Students have been removed from this class!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Something went wrong!");
    }
  });
};
