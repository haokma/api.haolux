import validator from "express-validator";
const { validationResult } = validator;

export default function (req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).json({
      status: "error",
      message: result.array()[0].msg,
    });
  }

  next();
}
