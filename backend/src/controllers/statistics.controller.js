const statisticsService =
    require("../services/statistics.service");

const getPlacementStatistics = async (req, res) => {

    try {

        const statistics =
            await statisticsService.getPlacementStatistics();

        res.status(200).json({
            success: true,
            message: "Placement statistics fetched successfully",
            data: statistics
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getPlacementStatistics
};