const studentService = require("../services/student.service");

const registerStudent = async (req, res) => {
    try{
        const student = await studentService.registerStudent(req.body);
        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: student
        })
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const loginStudent= async(req, res) => {
    try{
        const student = await studentService.loginStudent(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: student
        })
    }catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getProfile = async(req,res) =>{
    try{
        res.status(200).json({
            success: true,
            message: "Student profile fetched successfully",
            data: req.student
        })
    }catch(error){
        res.status(404).json({
            success:false,
            message: error.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const updatedStudent =
            await studentService.updateStudentProfile(
                req.student._id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Student profile updated successfully",
            data: updatedStudent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const uploadResume = async (req, res) => {
    try {
        const updatedStudent =
            await studentService.uploadStudentResume(
                req.student._id,
                req.file
            );

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: updatedStudent
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    getProfile,
    updateProfile,
    uploadResume
}