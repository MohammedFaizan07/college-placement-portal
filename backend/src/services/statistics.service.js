const Student = require("../models/Student");
const Company = require("../models/company.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");

const getPlacementStatistics = async () => {

    const totalStudents = await Student.countDocuments();

    const totalCompanies = await Company.countDocuments();

    const totalJobs = await Job.countDocuments();

    const totalApplications =
        await Application.countDocuments();

    const totalSelectedStudents =
        await Application.countDocuments({
            status: "SELECTED"
        });

    return {
        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalSelectedStudents
    };
};

module.exports = {
    getPlacementStatistics
};