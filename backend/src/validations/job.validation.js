const { body } = require("express-validator");

const createJobValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Job title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Job description is required"),

    body("skills")
        .isArray({ min: 1 })
        .withMessage("At least one skill is required"),

    body("skills.*")
        .trim()
        .notEmpty()
        .withMessage("Skill cannot be empty"),

    body("salary")
        .isFloat({ min: 0 })
        .withMessage("Salary must be a valid positive number"),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required"),

    body("jobType")
        .isIn(["Full Time", "Internship", "Part Time"])
        .withMessage(
            "Job type must be Full Time, Internship or Part Time"
        ),

    body("deadline")
        .isISO8601()
        .withMessage("Deadline must be a valid date")
];

const updateJobValidation = [

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Job title cannot be empty"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Job description cannot be empty"),

    body("skills")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one skill is required"),

    body("skills.*")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Skill cannot be empty"),

    body("salary")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Salary must be a valid positive number"),

    body("location")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Location cannot be empty"),

    body("jobType")
        .optional()
        .isIn(["Full Time", "Internship", "Part Time"])
        .withMessage(
            "Job type must be Full Time, Internship or Part Time"
        ),

    body("deadline")
        .optional()
        .isISO8601()
        .withMessage("Deadline must be a valid date"),

    body("status")
        .optional()
        .isIn(["OPEN", "CLOSED"])
        .withMessage("Status must be OPEN or CLOSED")
];

module.exports = {
    createJobValidation,
    updateJobValidation
};