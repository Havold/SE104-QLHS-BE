import prisma from "../client.js";
import jwt from "jsonwebtoken";

export const addStudentsToDTScoreBoard = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("YOU ARE NOT LOGIN!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(403).json("INVALID TOKEN!");
    }

    let { scoreBoardId, studentIds } = req.body;
    scoreBoardId = parseInt(scoreBoardId);

    try {
      // Kiểm tra bảng điểm có tồn tại không
      const scoreBoardExists = await prisma.scoreBoard.findUnique({
        where: {
          id: scoreBoardId,
        },
      });

      if (!scoreBoardExists) {
        return res.status(404).json("Score board not found!");
      }

      // Thêm học sinh vào lớp học sử dụng connect
      const studentClassData = studentIds.map((studentId) => ({
        studentId: studentId, // Chỉ định studentId trực tiếp
        scoreBoardId: scoreBoardId, // Chỉ định scoreBoardId trực tiếp
      }));

      // Sử dụng createMany để thêm nhiều bản ghi vào bảng
      const addedStudents = await prisma.dT_ScoreBoard.createMany({
        data: studentClassData,
        skipDuplicates: true, // Bỏ qua nếu học sinh đã được thêm
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
