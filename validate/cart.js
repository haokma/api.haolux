import validator from "express-validator";

const { check } = validator;

export const createCartValidate = [
  check("cartItemId").not().isEmpty().withMessage("cartItemId is required"),
  check("quantity")
    .isInt({ gt: 0, lt: 11 })
    .withMessage("Quantity is required, and in range 1-10"),
  check("size")
    .isIn([36, 37, 38, 39, 40, 41, 42, 43, 44, 45])
    .withMessage("Size is required, and in range 36-45"),
];

export const updateCartValidate = [
  check("quantity")
    .isInt({ gt: -1, lt: 51 })
    .withMessage("Quantity is required"),
];