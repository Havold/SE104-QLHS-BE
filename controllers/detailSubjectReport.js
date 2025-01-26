import jwt from "jsonwebtoken";
import prisma from "../client.js";

export const getDetailSubjectReport = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGGED IN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    const reportSubjectId = parseInt(req.params.id);
    try {
      const result = await prisma.dT_ReportSubject.findMany({
        where: {
          reportSubjectId: reportSubjectId,
        },
        include: {
          classSchoolYear: {
            select: {
              class: true,
            },
          },
        },
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json("An error occurred while fetching detail subject report data.");
    }
  });
};
