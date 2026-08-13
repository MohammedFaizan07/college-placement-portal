const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [String],
            required: true
        },

        salary: {
            type: Number,
            required: true,
            min: 0
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        jobType: {
            type: String,
            required: true,
            enum: ["Full Time", "Internship", "Part Time"]
        },

        deadline: {
            type: Date,
            required: true
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        status: {
            type: String,
            enum: ["OPEN", "CLOSED"],
            default: "OPEN"
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model(
    "Job",
    jobSchema
);

module.exports = Job;