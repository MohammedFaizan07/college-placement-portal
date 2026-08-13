const express = require("express");
const studentController = require("../controllers/student.controller");
const {registerStudentValidation,updateStudentValidation} = require("../validations/student.validation");
const validateRequest = require("../middleware/validation.middleware");
const router = express.Router();
const {authenticateStudent} = require("../middleware/auth.middleware");
const uploadResume = require("../middleware/upload.middleware");

router.post(
    "/register",
    registerStudentValidation,
    validateRequest,
    studentController.registerStudent
);

router.get(
    "/profile",
    authenticateStudent,
    studentController.getProfile
);

router.post("/login", studentController.loginStudent);
router.put("/profile", authenticateStudent,
    updateStudentValidation,
    validateRequest,
    studentController.updateProfile
)
router.post(
    "/resume",
    authenticateStudent,
    uploadResume.single("resume"),
    studentController.uploadResume
);

module.exports = router;