import jwt from "jsonwebtoken";
import prisma from "../client.js";

export const getAllResults = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    try {
      let query = {};
      const { ...queryParams } = req.query;
      if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
          switch (key) {
            case "studentId":
              query.student = {
                id: parseInt(value),
              };
              break;
            default:
              break;
          }
        }
      }
      const results = await prisma.result.findMany({
        where: query,
        include: {
          schoolYear: true,
        },
      });

      const enrichedResults = await Promise.all(
        results.map(async (result) => {
          let cs;
          cs = await prisma.classSchoolYear.findFirst({
            where: {
              schoolYearId: result.schoolYearId,
              studentsClass: {
                some: {
                  studentId: result.studentId,
                },
              },
            },
            select: {
              class: true,
            },
          });
          return { ...result, class: cs ? cs.class : null };
        })
      );
      return res.status(200).json(enrichedResults);
    } catch (error) {
      if (error) {
        console.log(error);
        return res.status(500).json(error);
      }
    }
  });
};
