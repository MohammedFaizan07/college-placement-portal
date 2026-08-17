const bcrypt = require("bcrypt");
const Company = require("../models/company.model");
const jwt = require("jsonwebtoken");

const registerCompany = async (companyData) => {

    const existingCompany = await Company.findOne({
        email: companyData.email
    });

    if (existingCompany) {
        throw new Error("Company with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
        companyData.password,
        10
    );

    const company = await Company.create({
        companyName: companyData.companyName,
        email: companyData.email,
        password: hashedPassword,
        phone: companyData.phone,
        website: companyData.website,
        industry: companyData.industry,
        description: companyData.description,
        role: "COMPANY"
    });

    const companyResponse = company.toObject();

    delete companyResponse.password;

    return companyResponse;
};

const loginCompany = async (email, password) => {
    const company = await Company.findOne({ email });

    if (!company) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        company.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            companyId: company._id,
            email: company.email,
            role: company.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        company: {
            id: company._id,
            companyName: company.companyName,
            email: company.email,
            role: company.role
        }
    };
};

const getCompanyProfile = async (companyId) => {
    const company = await Company.findById(companyId)
        .select("-password");

    if (!company) {
        throw new Error("Company not found");
    }

    return company;
};

const updateCompanyProfile = async (companyId, updateData) => {

    const company = await Company.findByIdAndUpdate(
        companyId,
        {
            companyName: updateData.companyName,
            phone: updateData.phone,
            website: updateData.website,
            industry: updateData.industry,
            description: updateData.description
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!company) {
        throw new Error("Company not found");
    }

    return company;
};

module.exports = {
    registerCompany,
    loginCompany,
    getCompanyProfile,
    updateCompanyProfile
};