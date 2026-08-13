const companyService = require("../services/company.service");

const registerCompany = async (req, res) => {
    try {

        const company =
            await companyService.registerCompany(req.body);

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            data: company
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await companyService.loginCompany(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: "Company login successful",
            data: result
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

const getCompanyProfile = async (req, res) => {
    try {
        const company =
            await companyService.getCompanyProfile(
                req.company._id
            );

        res.status(200).json({
            success: true,
            message: "Company profile fetched successfully",
            data: company
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerCompany,
    loginCompany,
    getCompanyProfile
};