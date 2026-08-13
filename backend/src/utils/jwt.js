const jwt = require("jsonwebtoken");

const  generateToken = (student) => {
    return jwt.sign({
        studentId: student._id,
        email: student.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
)
}

module.exports= {
    generateToken
}