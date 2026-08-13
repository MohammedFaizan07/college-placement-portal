const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        year: {
            type: Number,
            required: true,
        },

        cgpa: {
            type: Number,
            required: true,
        },

        skills: {
            type: [String],
            default: [],
        },

        profileImage: {
            type: String,
            default: "",
        },

        resume: {
            fileName: {
            type: String
        },
        filePath: {
            type: String
        },
        uploadedAt: {
            type: Date
        }
        },
    },
    {
        timestamps: true,
    }
);

const Student =
    mongoose.models.Student ||
    mongoose.model("Student", studentSchema);

module.exports = Student;