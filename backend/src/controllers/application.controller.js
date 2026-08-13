const applicationService =
    require("../services/application.service");

const applyForJob = async (req, res) => {
    try {

        const application =
            await applicationService.applyForJob(
                req.student._id,
                req.params.jobId
            );

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