const express = require("express");

const companyController =
    require("../controllers/company.controller");

const {
    registerCompanyValidation, loginCompanyValidation
} = require("../validations/company.validation");

const validateRequest =
    require("../middleware/validation.middleware");
const authenticateCompany =
    require("../middleware/companyAuth.middleware");

const router = express.Router();

router.post(
    "/register",
    registerCompanyValidation,
    validateRequest,
    companyController.registerCompany
);

router.post(
    "/login",
    loginCompanyValidation,
    validateRequest,
    companyController.loginCompany
);
router.get(
    "/profile",
    authenticateCompany,
    companyController.getCompanyProfile
);
router.put(
    "/profile",
    authenticateCompany,
    companyController.updateCompanyProfile
);

module.exports = router;