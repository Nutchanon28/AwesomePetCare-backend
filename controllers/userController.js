const User = require("../model/User");

const getAllUser = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -refreshToken")
            .exec();
        if (!users) return res.status(204).json({ message: "No users found" });
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getAllUser };
