const fs = require("fs");
const path = require("path");

const saveResumeFile = (file) => {
    const uploadDirectory = path.join(
        __dirname,
        "../uploads/resumes"
    );

    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, {
            recursive: true
        });
    }

    const fileName = `resume-${Date.now()}${path.extname(file.originalname)}`;

    const filePath = path.join(
        uploadDirectory,
        fileName
    );

    fs.writeFileSync(
        filePath,
        file.buffer
    );

    return {
        fileName,
        filePath
    };
};

module.exports = {
    saveResumeFile
};