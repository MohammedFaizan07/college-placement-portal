const {body} = require("express-validator");

const registerStudentValidation = [
     body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),

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

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

    body("year")
        .isInt({ min: 1, max: 4 })
        .withMessage("Year must be between 1 and 4"),

    body("cgpa")
        .isFloat({ min: 0, max: 10})
        .withMessage("CGPA must be between 0 and 10")
]

const updateStudentValidation = [
    body("fullName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Full name cannot be empty"),

    body("phone")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Phone number cannot be empty"),

    body("department")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Department cannot be empty"),

    body("year")
        .optional()
        .isInt({ min: 1, max: 4 })
        .withMessage("Year must be between 1 and 4"),

    body("cgpa")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("CGPA must be between 0 and 10"),

    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array")
];

module.exports = {
    registerStudentValidation,
    updateStudentValidation
}