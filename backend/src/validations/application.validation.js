const { body } = require("express-validator");

const updateApplicationStatusValidation = [
    body("status")
        .isIn([
            "APPLIED",
            "SHORTLISTED",
            "REJECTED",
            "SELECTED"
        ])
        .withMessage(
            "Status must be APPLIED, SHORTLISTED, REJECTED or SELECTED"
        )
];

module.exports = {
    updateApplicationStatusValidation
};