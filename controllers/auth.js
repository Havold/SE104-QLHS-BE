import prisma from "../client.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, sex, birth, role } =
      req.body;

    // CHECK USER
    const existingUser = await prisma.student.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(403).json("Account already exists");
    }

    const selectedRole = await prisma.role.findUnique({
      where: {
        name: role,
      },
    });

    if (!selectedRole) {
      return res.status(400).json("Invalid role specified!");
    }

    // HASH PASSWORD
    const salt = bcryptjs.genSaltSync(10);
    const hashPassword = bcryptjs.hashSync(password, salt);

    // CREATE NEW USER
    const newUser = await prisma.student.create({
      data: {
        username,
        email,
        password: hashPassword,
        fullName,
        phone,
        sex,
        birth,
        roleId: selectedRole.id,
        img: "/assets/noAvatar.jpg", // Default profile picture
      },
    });

    return res.status(200).json("New user has been created!");
  } catch (err) {
    console.error("Error in register:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // CHECK USER
    const user = await prisma.student.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            authorities: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // CHECK PASSWORD
    const checkedPassword = bcryptjs.compareSync(password, user.password);

    if (!checkedPassword) {
      return res.status(400).json("Wrong username or password!");
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        authorities: user.role.authorities.map((authority) => authority.name),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // EXCLUDE PASSWORD BEFORE SENDING RESPONSE
    const { password: _, ...others } = user;

    res
      .cookie("accessToken", token, {
        secure: true,
        sameSite: "None",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json(others);
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out!");
};

// CHECK TOKEN
export const checkToken = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(200).json({ isAuthenticated: false });
  else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
      if (err) {
        res.status(403).json("INVALID TOKEN");
      }

      const user = await prisma.student.findUnique({
        where: {
          id: userInfo.id,
        },
        include: {
          role: {
            include: {
              authorities: true,
            },
          },
        },
      });

      const { password: _, ...others } = user;

      console.log(others);

      return res.status(200).json({ isAuthenticated: true, user: others });
    });
  }
};
