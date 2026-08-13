const Job = require("../models/job.model");

const createJob = async (jobData, companyId) => {
    const job = await Job.create({
        title: jobData.title,
        description: jobData.description,
        skills: jobData.skills,
        salary: jobData.salary,
        location: jobData.location,
        jobType: jobData.jobType,
        deadline: jobData.deadline,
        company: companyId
    });

    return job;
};

const getAllJobs = async () => {
    const jobs = await Job.find({
        status: "OPEN"
    })
        .populate(
            "company",
            "companyName email industry website"
        )
        .sort({
            createdAt: -1
        });

    return jobs;
};

const getJobById = async (jobId) => {
    const job = await Job.findById(jobId)
    .populate(
            "company",
            "companyName email industry website"
        );
     if (!job) {
        throw new Error("Job not found");
    }

    return job;
}

const updateJob = async (jobId, companyId, updateData) => {

    const job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.company.toString() !== companyId.toString()) {
        throw new Error(
            "You are not authorized to update this job"
        );
    }

    const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).populate(
        "company",
        "companyName email industry website"
    );

    return updatedJob;
};

const deleteJob = async (jobId, companyId) => {

    const job = await Job.findById(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.company.toString() !== companyId.toString()) {
        throw new Error(
            "You are not authorized to delete this job"
        );
    }

    await Job.findByIdAndDelete(jobId);

    return true;
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};