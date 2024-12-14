import { skip } from "@prisma/client/runtime/library";
import prisma from "../client.js";

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
