import { skip } from "@prisma/client/runtime/library";
import prisma from "../client.js";
import jwt from "jsonwebtoken";

export const getAllSubjects = async (req, res) => {
  const { page, pageItems, ...queryParams } = req.query;
  const p = page ? parseInt(page) : 1;
  const pItems = pageItems ? parseInt(pageItems) : 5;
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
    const [subjects, count] = await prisma.$transaction([
      prisma.subject.findMany({
        where: query,
        take: pItems,
        skip: (p - 1) * pItems,
      }),
      prisma.subject.count(),
    ]);
    // const subjects = await prisma.subject.findMany();
    res.status(200).json({ subjects, totalCount: count });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

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
