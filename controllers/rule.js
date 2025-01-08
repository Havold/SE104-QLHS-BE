import prisma from "../client.js";
import jwt from "jsonwebtoken";

// GET ALL RULES
export const getAllRules = async (req, res) => {
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
    const count = await prisma.parameter.count({ where: query });

    // Nếu type là "all", lấy toàn bộ dữ liệu mà không áp dụng phân trang
    let parameters;
    if (type === "all") {
      parameters = await prisma.parameter.findMany({
        where: query,
        orderBy: {
          ["name"]: "asc", // Sắp xếp theo trường và thứ tự
        },
      });
      res.status(200).json({ parameters, totalCount: count, currentPage: 1 });
      return;
    }

    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }

    if (p <= 0) {
      p = 1;
    }

    parameters = await prisma.parameter.findMany({
      where: query,
      select: {
        id: true,
        name: true,
        value: true,
      },
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res.status(200).json({ parameters, totalCount: count, currentPage: p });
  } catch (error) {
    console.log("Error fetching Classes data: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

// GET A RULES
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

// ADD RULES
export const addRule = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN!");
    }
    let inputName = req.body.name;
    let inputValue = req.body.value;
    const existingRule = await prisma.parameter.findFirst({
      where: {
        name: inputName,
      },
    });

    if (existingRule) {
      return res.status(403).json("This rule already exists!");
    }

    await prisma.parameter.create({
      data: {
        name: inputName,
        value: inputValue,
      },
    });

    return res.status(200).json("New rule has been added!");
  });
};

// DELETE RULES
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

// UPDATE RULE
export const updateRule = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(403).json("INVALID TOKEN");
    }

    await prisma.parameter.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        value: parseFloat(req.body.value),
      },
    });

    return res.status(200).json("Updated rule successfully!");
  });
};
