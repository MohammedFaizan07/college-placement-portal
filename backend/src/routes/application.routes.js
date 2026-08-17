const express = require("express");

const applicationController =
    require("../controllers/application.controller");

const { authenticateStudent } =
    require("../middleware/auth.middleware");

const authenticateCompany =
    require("../middleware/companyAuth.middleware");

const router = express.Router();

router.post(
    "/jobs/:jobId/apply",
    authenticateStudent,
    applicationController.applyForJob
);

router.get(
    "/applications/my-applications",
    authenticateStudent,
    applicationController.getMyApplications
);

router.get(
    "/applications/job/:jobId",
    authenticateCompany,
    applicationController.getJobApplicants
);

router.put(
    "/applications/:applicationId/status",
    authenticateCompany,
    applicationController.updateApplicationStatus
);

module.exports = router;