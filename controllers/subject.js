import { skip } from "@prisma/client/runtime/library";
import prisma from "../client.js";
import jwt from "jsonwebtoken";

// GET ALL SUBJECTS
export const getAllSubjects = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
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
    const count = await prisma.subject.count();
    if (p * pItems > count) {
      p = Math.ceil(count / pItems);
    }
    const subjects = await prisma.subject.findMany({
      where: query,
      take: pItems,
      skip: (p - 1) * pItems,
    });
    res.status(200).json({ subjects, totalCount: count, currentPage: p });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// GET A SUBJECT
export const getSubject = async (req, res) => {
  const subjectId = parseInt(req.params.id);
  try {
    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
      },
    });
    res.status(200).json(subject);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// METHOD POST
export const addSubject = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const existingSubject = await prisma.subject.findUnique({
      where: {
        name: req.body.name,
      },
    });

    if (existingSubject) {
      return res.status(403).json("This subject already exists");
    }

    await prisma.subject.create({
      data: {
        name: req.body.name,
      },
    });
    return res.status(200).json("New subject has been added!");
  });
};

// METHOD DELETE
export const deleteSubject = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const subjectId = parseInt(req.params.id);

    const subject = await prisma.subject.findUnique({
      select: {
        name: true,
      },
      where: {
        id: subjectId,
      },
    });
    await prisma.subject.delete({
      where: {
        id: subjectId,
      },
    });
    return res.status(200).json(`${subject.name} has been deleted!`);
  });
};

// METHOD UPDATE SUBJECT
export const updateSubject = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU'RE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const newName = req.body.name;

    const existingName = await prisma.subject.findUnique({
      where: {
        name: newName,
      },
    });

    if (existingName) {
      return res.status(403).json("This subject already exist!");
    } else {
      const subjectId = parseInt(req.params.id);
      await prisma.subject.update({
        where: {
          id: subjectId,
        },
        data: {
          name: newName,
        },
      });

      return res.status(200).json("Subject updated successfully!");
    }
  });
};
