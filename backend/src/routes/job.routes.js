const express = require("express");

const jobController =
    require("../controllers/job.controller");

const authenticateCompany =
    require("../middleware/companyAuth.middleware");

const {
    createJobValidation, updateJobValidation
} = require("../validations/job.validation");

const validateRequest =
    require("../middleware/validation.middleware");

const router = express.Router();

router.post(
    "/",
    authenticateCompany,
    createJobValidation,
    validateRequest,
    jobController.createJob
);

router.get(
    "/",
    jobController.getAllJobs
);
router.get(
    "/:jobId",
    jobController.getJobById
);
router.put(
    "/:jobId",
    authenticateCompany,
    updateJobValidation,
    validateRequest,
    jobController.updateJob
);
router.delete(
    "/:jobId",
    authenticateCompany,
    jobController.deleteJob
);

module.exports = router;