const { body } = require("express-validator");

const registerCompanyValidation = [
    body("companyName")
        .trim()
        .notEmpty()
        .withMessage("Company name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),

    body("industry")
        .trim()
        .notEmpty()
        .withMessage("Industry is required"),

    body("website")
        .optional()
        .trim(),

    body("description")
        .optional()
        .trim()
];

const loginCompanyValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

module.exports = {
    registerCompanyValidation,
    loginCompanyValidation
};