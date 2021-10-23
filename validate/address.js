import validator from "express-validator";

const { check } = validator;

export const createAddressValidate = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("phone").not().isEmpty().withMessage("Phone is required"),
  check("city").not().isEmpty().withMessage("City is required"),
  check("town").not().isEmpty().withMessage("Town is required"),
  check("address").not().isEmpty().withMessage("Address is required"),
];
