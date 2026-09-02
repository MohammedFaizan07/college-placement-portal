const applicationService =
    require("../services/application.service");
const { getIO } = require("../sockets/socket");
const Job = require("../models/job.model");

const applyForJob = async (req, res) => {
    try {

        const application =
            await applicationService.applyForJob(
                req.student._id,
                req.params.jobId
            );

        // Populate application with job and student details
        const populatedApp = await application.populate("job").populate("student");
        
        // Get company details from the job
        const job = await Job.findById(req.params.jobId).populate("company");

        // Emit WebSocket event to the company's room (new application received)
        const io = getIO();
        if (job && job.company) {
            const companyRoomId = `company:${job.company._id}`;
            io.to(companyRoomId).emit("application:created", {
                applicationId: application._id,
                jobId: application.job,
                jobTitle: populatedApp.job.title,
                studentName: populatedApp.student.name || populatedApp.student.email,
                studentEmail: populatedApp.student.email,
                appliedAt: application.appliedAt,
                status: application.status
            });
        }

        res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            data: application
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getMyApplications = async (req, res) => {
    try {

        const applications =
            await applicationService.getMyApplications(
                req.student._id
            );

        res.status(200).json({
            success: true,
            message: "Applications fetched successfully",
            data: applications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};const getJobApplicants = async (req, res) => {
    try {

        const applications =
            await applicationService.getJobApplicants(
                req.params.jobId,
                req.company._id
            );

        res.status(200).json({
            success: true,
            message: "Applicants fetched successfully",
            data: applications
        });

    } catch (error) {

        res.status(403).json({
            success: false,
            message: error.message
        });

    }
};

const updateApplicationStatus = async (req, res) => {
    try {

        const application =
            await applicationService.updateApplicationStatus(
                req.params.applicationId,
                req.company._id,
                req.body.status
            );

        // Populate application for WebSocket event
        const populatedApp = await application.populate("job").populate("student");

        // Emit WebSocket event to the student's room
        const io = getIO();
        if (populatedApp.student) {
            const studentRoomId = `student:${populatedApp.student._id}`;
            io.to(studentRoomId).emit("application:statusUpdated", {
                applicationId: application._id,
                jobId: application.job,
                jobTitle: populatedApp.job.title,
                status: application.status,
                updatedAt: application.updatedAt,
                message: `Your application status has been updated to ${application.status}`
            });
        }

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application
        });

    } catch (error) {

        res.status(403).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
};