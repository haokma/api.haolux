import bcrypt from "bcryptjs"; //mã hóa password
import jwt from "jsonwebtoken"; //tokens

import User from "../models/user.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "Người dùng không tồn tại!" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Thông tin không hợp lệ!" });

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      "test",
      { expiresIn: "1000d" }
    );

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );

    res.status(200).json({ result: existingUser, token, refreshToken });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  let role = 0;

  try {
    if (req.body.role) {
      role = req.body.role * 1;
    }
    const existingUser = await User.findOne({ email });
    console.log(email);

    if (existingUser)
      return res.status(400).json({ message: "Người dùng đã tồn tại !" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Mật khẩu không trùng khớp" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      role,
    });

    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      "test",
      { expiresIn: "1000d" }
    );

    const refreshToken = jwt.sign(
      { id: result._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );

    res.status(200).json({ result, token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signout = (req, res) => {
  // sau này nếu dùng cookie thì mới cần

  res.status(200).json({
    message: 'Đăng xuất thành công!'
  })
}
