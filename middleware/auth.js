import jwt from "jsonwebtoken";
import util from "util";
import User from "../models/user.js";

export const signinRequire = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    )
      return res.status(400).json({
        status: "error",
        message: "Authorization is required, please login to get access",
      });

    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodeData;

    if (token && isCustomAuth) {
      decodeData = await util.promisify(jwt.verify)(token, "test");
      req.userId = decodeData && decodeData.id;
    } else {
      decodeData = jwt.decode(token);

      req.userId = decodeData && decodeData.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export const userProfile = async (req, res, next) => {
  try {
    if (!req.userId)
      return res.status(400).json({
        status: "error",
        error: "Some thing went wrong, please sign in ",
      });

    const user = await User.findById(req.userId);

    if (!user)
      return res.status(400).json({
        status: "error",
        error: "Do not find user",
      });

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

export const userRequire = async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).json({
        status: "error",
        error: "Some thing went wrong, please sign in ",
      });

    if (req.user.role !== 0)
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

export const adminRequire = async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).json({
        status: "error",
        error: "Some thing went wrong, please sign in ",
      });

    if (req.user.role !== 1)
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

export const getNewToken = async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(400).json({
        status: "error",
        error: "Some thing went wrong, please sign in ",
      });

    const { refToken } = req.body || req.params;

    if (!refToken)
      return res.status(400).json({
        status: "error",
        error: "Some thing went wrong, please send refresh token again ",
      });

    let decodeRefToken = await util.promisify(jwt.verify)(
      refToken,
      process.env.JWT_SECRET_KEY
    );

    if (decodeRefToken.id != req.user._id)
      return res.status(400).json({
        status: "error",
        error:
          "Some thing went wrong, user does not match, please login again ",
      });

    const curUser = await User.findById(decodeRefToken.id);

    console.log(curUser);

    if (!curUser)
      return res.status(403).json({
        status: "fail",
        message: "The user doest not exist",
      });

    let newToken = jwt.sign({ email: curUser.email, id: curUser._id }, "test", {
      expiresIn: "1h",
    });

    const newRefreshToken = jwt.sign(
      { id: curUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );

    res.status(200).json({
      user: curUser,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};
