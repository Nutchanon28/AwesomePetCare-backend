const User = require("../model/User");

const getProfile = async (req, res) => {
    res.status(200).json({ message: "pass verifyJWT" });
};

module.exports = { getProfile };
