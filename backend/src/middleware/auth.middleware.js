const jwt = require("jsonwebtoken");

const Student = require("../models/Student");

const authenticateStudent = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization header missing"

            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        const student = await Student.findById(

            decoded.studentId

        ).select("-password");

        if (!student) {

            return res.status(401).json({

                success: false,

                message: "Student not found"

            });

        }

        req.student = student;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token"

        });

    }

};

module.exports = {

    authenticateStudent

};