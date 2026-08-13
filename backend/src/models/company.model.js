const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        website: {
            type: String,
            trim: true
        },

        industry: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        role: {
            type: String,
            default: "COMPANY"
        }
    },
    {
        timestamps: true
    }
);

const Company = mongoose.model(
    "Company",
    companySchema
);

module.exports = Company;