const jobService = require("../services/job.service");
const { getIO } = require("../sockets/socket");

const createJob = async (req, res) => {
    try {

        const job = await jobService.createJob(
            req.body,
            req.company._id
        );

        // Emit WebSocket event for new job
        const populatedJob = await job.populate("company", "companyName email industry website");
        const io = getIO();
        io.emit("job:created", {
            jobId: job._id,
            title: job.title,
            company: populatedJob.company.companyName,
            location: job.location,
            createdAt: job.createdAt,
            fullJob: populatedJob
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getAllJobs = async (req, res) => {
    try {

        const jobs = await jobService.getAllJobs();

        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getJobById = async (req, res) => {
    try{
         const job = await jobService.getJobById(
            req.params.jobId
        );

        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data : job})
    }catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }
}

const updateJob = async (req, res) => {
    try {

        const updatedJob =
            await jobService.updateJob(
                req.params.jobId,
                req.company._id,
                req.body
            );

        // Emit WebSocket event for job update
        const io = getIO();
        io.emit("job:updated", {
            jobId: updatedJob._id,
            title: updatedJob.title,
            company: updatedJob.company.companyName,
            location: updatedJob.location,
            updatedAt: updatedJob.updatedAt,
            fullJob: updatedJob
        });

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const deleteJob = async (req, res) => {
    try {

        // Get job details before deletion for the event
        const Job = require("../models/job.model");
        const jobDetails = await Job.findById(req.params.jobId).populate("company", "companyName");

        await jobService.deleteJob(
            req.params.jobId,
            req.company._id
        );

        // Emit WebSocket event for job deletion
        if (jobDetails) {
            const io = getIO();
            io.emit("job:deleted", {
                jobId: jobDetails._id,
                title: jobDetails.title,
                company: jobDetails.company.companyName,
                deletedAt: new Date()
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};