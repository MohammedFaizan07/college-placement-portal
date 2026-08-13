const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/student.routes");
const companyRoutes = require("./routes/company.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const statisticsRoutes =
    require("./routes/statistics.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("College Placement Portal API is running...");
});

app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api/statistics", statisticsRoutes);

module.exports = app;
