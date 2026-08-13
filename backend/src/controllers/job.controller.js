const jobService = require("../services/job.service");

const createJob = async (req, res) => {
    try {

        const job = await jobService.createJob(
            req.body,
            req.company._id
        );

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

        await jobService.deleteJob(
            req.params.jobId,
            req.company._id
        );

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