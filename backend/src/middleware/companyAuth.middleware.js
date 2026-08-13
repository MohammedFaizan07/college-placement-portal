const jwt = require("jsonwebtoken");

const Company = require("../models/company.model");

const authenticateCompany = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const company = await Company.findById(
            decoded.companyId
        ).select("-password");

        if (!company) {
            return res.status(401).json({
                success: false,
                message: "Company not found"
            });
        }

        req.company = company;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateCompany;