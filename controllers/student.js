import prisma from "../client.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  const { page, subPage, pageItems, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let subP = subPage ? parseInt(subPage) : null;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "classId": // Xử lý classId
        case "schoolYearId": // Xử lý schoolYearId
          if (!query.studentClasses)
            query.studentClasses = { some: { classSchoolYear: {} } };
          if (key === "classId") {
            query.studentClasses.some.classSchoolYear.classId = parseInt(value);
          }
          if (key === "schoolYearId") {
            query.studentClasses.some.classSchoolYear.schoolYearId =
              parseInt(value);
          }
          break;
        case "type":
          if (value === "exclude") {
            query = {
              NOT: {
                studentClasses: {
                  some: {
                    classSchoolYear: {
                      classId: parseInt(queryParams.classId),
                      schoolYearId: parseInt(queryParams.schoolYearId),
                    },
                  },
                },
              },
            };
          }
          break;
        case "search":
          query.fullName = {
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

    const count = await prisma.student.count({ where: query });
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    const students = await prisma.student.findMany({
      where: query,
      include: {
        results: true,
        studentClasses: {
          include: {
            classSchoolYear: {
              include: {
                schoolYear: true,
                class: {
                  include: {
                    grade: true,
                  },
                },
              },
            },
          },
        },
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

// export const getAllStudents = async (req, res) => {
//   const { page, subPage, pageItems, ...queryParams } = req.query;
//   let p = page ? parseInt(page) : 1;
//   let subP = subPage ? parseInt(subPage) : null;
//   let pItems = pageItems ? parseInt(pageItems) : 5;

//   // Các điều kiện lọc
//   let excludeCondition = null;
//   let searchCondition = null;

//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       switch (key) {
//         case "classId":
//         case "schoolYearId":
//           if (!excludeCondition)
//             excludeCondition = {
//               NOT: {
//                 studentClasses: {
//                   some: {
//                     classSchoolYear: {},
//                   },
//                 },
//               },
//             };
//           if (key === "classId") {
//             excludeCondition.NOT.studentClasses.some.classSchoolYear.classId =
//               parseInt(value);
//           }
//           if (key === "schoolYearId") {
//             excludeCondition.NOT.studentClasses.some.classSchoolYear.schoolYearId =
//               parseInt(value);
//           }
//           break;
//         case "search":
//           searchCondition = {
//             fullName: {
//               contains: value,
//               mode: "insensitive",
//             },
//           };
//           break;
//         default:
//           break;
//       }
//     }
//   }

//   try {
//     if (subP) {
//       p = subP;
//     }

//     // Bước 1: Lọc loại trừ (exclude)
//     let initialStudents = [];
//     if (excludeCondition) {
//       initialStudents = await prisma.student.findMany({
//         where: excludeCondition,
//         include: {
//           results: true,
//           studentClasses: {
//             include: {
//               classSchoolYear: {
//                 include: {
//                   schoolYear: true,
//                   class: {
//                     include: {
//                       grade: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });
//     } else {
//       // Nếu không có excludeCondition, lấy tất cả học sinh
//       initialStudents = await prisma.student.findMany({
//         include: {
//           results: true,
//           studentClasses: {
//             include: {
//               classSchoolYear: {
//                 include: {
//                   schoolYear: true,
//                   class: {
//                     include: {
//                       grade: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });
//     }

//     // Bước 2: Lọc tìm kiếm (search)
//     let filteredStudents = initialStudents;
//     if (searchCondition) {
//       filteredStudents = initialStudents.filter((student) =>
//         student.fullName
//           .toLowerCase()
//           .includes(searchCondition.fullName.contains.toLowerCase())
//       );
//     }

//     // Phân trang
//     const totalCount = filteredStudents.length;
//     const startIdx = (p - 1) * pItems;
//     const paginatedStudents = filteredStudents.slice(
//       startIdx,
//       startIdx + pItems
//     );

//     res
//       .status(200)
//       .json({ students: paginatedStudents, totalCount, currentPage: p });
//   } catch (error) {
//     console.log("Error fetching Classes data: ", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error.",
//       error: error.message,
//     });
//   }
// };

// GET A STUDENT
export const getStudent = async (req, res) => {
  const studentId = parseInt(req.params.id);
  try {
    const student = await prisma.student.findFirst({
      include: {
        results: true,
        role: true,
        studentClasses: {
          include: {
            classSchoolYear: {
              include: {
                schoolYear: true,
                class: {
                  include: {
                    grade: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: studentId,
      },
    });

    res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// ADD A STUDENT
export const addStudent = async (req, res) => {
  const token = req.cookies.accessToken;

  // Check if token is provided
  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  try {
    // Verify token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const {
      username,
      sex,
      phone,
      password,
      fullName,
      email,
      address,
      birthday,
      img,
    } = req.body;

    // Check if username already exists
    let existingStudent = await prisma.student.findUnique({
      where: {
        username: username,
      },
    });
    if (existingStudent) {
      return res.status(403).json("This username already exists!");
    }

    // Check if email already exists
    existingStudent = await prisma.student.findUnique({
      where: {
        email: email,
      },
    });
    if (existingStudent) {
      return res.status(403).json("This email is already used!");
    }

    // Check if phone already exists
    existingStudent = await prisma.student.findUnique({
      where: {
        phone: phone,
      },
    });
    if (existingStudent) {
      return res.status(403).json("This phone is already used!");
    }

    // Hash password
    const salt = bcryptjs.genSaltSync(10);
    const hashPassword = bcryptjs.hashSync(password, salt);
    const roleId = 3;

    // Create new student
    await prisma.student.create({
      data: {
        username,
        sex,
        phone,
        password: hashPassword,
        fullName,
        email,
        address,
        img,
        birth: birthday,
        role: {
          connect: {
            id: roleId,
          },
        },
      },
    });

    // Send success response
    res.status(200).json("New student has been added!");
  } catch (error) {
    // Handle errors
    console.error("Error in adding new student :", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE STUDENT
export const updateStudent = async (req, res) => {
  const token = req.cookies.accessToken;

  // Check if token is provided
  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  try {
    // Verify token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    // Extract fields from request body
    const {
      username,
      sex,
      phone,
      password,
      fullName,
      email,
      address,
      birthday,
      img,
    } = req.body;

    const studentId = parseInt(req.params.id);

    // Fetch existing student
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      return res.status(404).json("Student not found!");
    }

    // Check if username is unique
    if (username && username !== existingStudent.username) {
      const usernameCheck = await prisma.student.findUnique({
        where: { username },
      });
      if (usernameCheck) {
        return res.status(403).json("This username already exists!");
      }
    }

    // Check if email is unique
    if (email && email !== existingStudent.email) {
      const emailCheck = await prisma.student.findUnique({
        where: { email },
      });
      if (emailCheck) {
        return res.status(403).json("This email is already used!");
      }
    }

    // Check if phone is unique
    if (phone && phone !== existingStudent.phone) {
      const phoneCheck = await prisma.student.findUnique({
        where: { phone },
      });
      if (phoneCheck) {
        return res.status(403).json("This phone is already used!");
      }
    }

    // Hash password if it's provided
    let hashPassword = existingStudent.password; // Keep the old password by default
    if (password != hashPassword) {
      // HASH PASSWORD
      const salt = bcryptjs.genSaltSync(10);
      hashPassword = bcryptjs.hashSync(password, salt);
    }

    // Prepare data for update
    const updateData = {
      username,
      sex,
      phone,
      password: hashPassword,
      fullName,
      email,
      address,
      birth: birthday,
      img: img,
    };

    // Update student
    await prisma.student.update({
      where: { id: studentId },
      data: updateData,
    });

    // Send success response
    res.status(200).json("Updated student successfully!");
  } catch (error) {
    // Handle errors
    console.error("Error in adding new student :", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE A STUDENT
export const deleteStudent = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const studentId = parseInt(req.params.id);

    const student = await prisma.student.findUnique({
      select: {
        username: true,
      },
      where: {
        id: studentId,
      },
    });
    await prisma.student.delete({
      where: {
        id: studentId,
      },
    });
    return res.status(200).json(`${student.username} has been deleted!`);
  });
};
