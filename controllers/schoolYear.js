import prisma from "../client.js";
import jwt from "jsonwebtoken";

// GET ALL SCHOOL YEAR
export const getAllSchoolYears = async (req, res) => {
  const { page, pageItems, type, ...queryParams } = req.query;
  let p = page ? parseInt(page) : 1;
  let pItems = pageItems ? parseInt(pageItems) : 5;
  let query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "search":
          if (value) {
            const searchValue = parseInt(value);
            if (!isNaN(searchValue)) {
              query.value = {
                equals: searchValue,
              };
            } else {
              return res.status(500).json("Input search should be a number!");
            }
          }

          break;
        default:
          break;
      }
    }
  }

  try {
    const count = await prisma.schoolYear.count({ where: query });

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let schoolYears;
    if (type === "all") {
      schoolYears = await prisma.schoolYear.findMany({
        where: query,
        orderBy: {
          ["value"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res.status(200).json({ schoolYears, totalCount: count, currentPage: 1 });
      return;
    }

    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    schoolYears = await prisma.schoolYear.findMany({
      where: query,
      take: pItems,
      skip: (p - 1) * pItems,
      orderBy: {
        ["value"]: "asc", // Sắp xếp theo trường và thứ tự
      },
    });
    res.status(200).json({ schoolYears, totalCount: count, currentPage: p });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// ADD A SCHOOL YEAR
export const addSchoolYear = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const inputValue = req.body.value;

    const existingSchoolYear = await prisma.schoolYear.findUnique({
      where: {
        value: inputValue,
      },
    });

    if (existingSchoolYear) {
      return res.status(403).json("This school year already exists");
    }

    await prisma.schoolYear.create({
      data: {
        value: inputValue,
      },
    });
    return res.status(200).json("New school year has been added!");
  });
};

// UPDATE SCHOOL YEAR
export const updateSchoolYear = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  try {
    // Verify token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    // Parse grade ID from params
    const schoolYearId = parseInt(req.params.id);
    if (isNaN(schoolYearId)) {
      return res.status(400).json("Invalid school year ID!");
    }

    // Find the existing grade
    const existingSchoolYear = await prisma.schoolYear.findUnique({
      where: {
        id: schoolYearId,
      },
    });

    if (!existingSchoolYear) {
      return res.status(404).json("School year not found!");
    }

    // Check for name updates
    const newValue = req.body.value;
    if (newValue && newValue !== existingSchoolYear.value) {
      // Check if new name already exists
      const valueCheck = await prisma.schoolYear.findUnique({
        where: {
          value: newValue,
        },
      });

      if (valueCheck) {
        return res.status(403).json("This school year already exists!");
      }

      // Update grade name
      await prisma.schoolYear.update({
        where: {
          id: schoolYearId,
        },
        data: {
          value: req.body.value,
        },
      });

      return res.status(200).json("School year updated successfully!");
    }

    // No changes detected
    return res
      .status(400)
      .json("No updates made. School year remains unchanged.");
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json("INVALID TOKEN!");
    }
    console.error("Error updating grade:", error);
    return res.status(500).json("Internal server error.");
  }
};

// DELETE SCHOOL YEAR
export const deleteSchoolYear = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const schoolYearId = parseInt(req.params.id);

    const schoolYear = await prisma.schoolYear.findUnique({
      select: {
        value: true,
      },
      where: {
        id: schoolYearId,
      },
    });
    await prisma.schoolYear.delete({
      where: {
        id: schoolYearId,
      },
    });
    return res.status(200).json(`${schoolYear.value} has been deleted!`);
  });
};
