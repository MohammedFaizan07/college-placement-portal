const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        status: {
            type: String,
            enum: [
                "APPLIED",
                "SHORTLISTED",
                "REJECTED",
                "SELECTED"
            ],
            default: "APPLIED"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { student: 1, job: 1 },
    { unique: true }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;