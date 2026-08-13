const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const { generateToken } =
require("../utils/jwt");
const { saveResumeFile } = require("../utils/file.utils");

const registerStudent = async (studentData) => {
    const existingStudent = await Student.findOne({
        email: studentData.email
    })
    if (existingStudent) {
        throw new Error("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(studentData.password, 10);
    studentData.password = hashedPassword;
    const student = await Student.create(studentData);

    return student;
}

const loginStudent = async (loginData) => {

    const student =
        await Student.findOne({

            email: loginData.email

        });

    if (!student) {

        throw new Error("Student not found");

    }

    const isPasswordMatched =
        await bcrypt.compare(

            loginData.password,

            student.password

        );

    if (!isPasswordMatched) {

        throw new Error("Invalid password");

    }
    const token = generateToken(student);
    const studentResponse =student.toObject();
    delete studentResponse.password;

return {

    student: studentResponse,

    token

};

};

const updateStudentProfile = async (studentId, updateData) => {
    const allowedFields = [
        "fullName",
        "phone",
        "department",
        "year",
        "cgpa",
        "skills"
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            updates[field] = updateData[field];
        }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        updates,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!updatedStudent) {
        throw new Error("Student not found");
    }

    return updatedStudent;
};

const uploadStudentResume = async (studentId, file) => {
    if (!file) {
        throw new Error("Resume file is required");
    }

    const savedFile = saveResumeFile(file);

    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        {
            resume: {
                fileName: savedFile.fileName,
                filePath: savedFile.filePath,
                uploadedAt: new Date()
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!updatedStudent) {
        throw new Error("Student not found");
    }

    return updatedStudent;
};

module.exports = {
    registerStudent,
    loginStudent,
    updateStudentProfile,
    uploadStudentResume
};