const express = require("express");

const statisticsController =
    require("../controllers/statistics.controller");

const router = express.Router();

router.get(
    "/",
    statisticsController.getPlacementStatistics
);

module.exports = router;