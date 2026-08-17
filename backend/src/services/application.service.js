const Application = require("../models/application.model");
const Job = require("../models/job.model");


// Student applies for a job
const applyForJob = async (studentId, jobId) => {

    // Check whether the job exists
    const job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    // Check whether the student has already applied
    const existingApplication = await Application.findOne({
        student: studentId,
        job: jobId
    });

    if (existingApplication) {
        throw new Error("You have already applied for this job");
    }

    // Create application
    const application = await Application.create({
        student: studentId,
        job: jobId,
        status: "APPLIED"
    });

    return application;
};


// Student views their applications
const getMyApplications = async (studentId) => {

    const applications = await Application.find({
        student: studentId
    })
        .populate("job")
        .sort({ createdAt: -1 });

    return applications;
};


// Company views applicants for a particular job
const getJobApplicants = async (jobId, companyId) => {

    // Check whether the job exists
    const job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    // Make sure this job belongs to the logged-in company
    if (job.company.toString() !== companyId.toString()) {
        throw new Error(
            "You are not authorized to view applicants for this job"
        );
    }

    const applications = await Application.find({
        job: jobId
    })
        .populate("student", "-password")
        .populate("job")
        .sort({ createdAt: -1 });

    return applications;
};


// Company updates application status
const updateApplicationStatus = async (
    applicationId,
    companyId,
    status
) => {

    const application = await Application.findById(applicationId);

    if (!application) {
        throw new Error("Application not found");
    }

    // Find the job related to this application
    const job = await Job.findById(application.job);

    if (!job) {
        throw new Error("Job not found");
    }

    // Make sure the logged-in company owns the job
    if (job.company.toString() !== companyId.toString()) {
        throw new Error(
            "You are not authorized to update this application"
        );
    }

    // Allow only valid application statuses
    const allowedStatuses = [
        "APPLIED",
        "SHORTLISTED",
        "SELECTED",
        "REJECTED"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid application status");
    }

    application.status = status;

    await application.save();

    return application;
};


module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
};