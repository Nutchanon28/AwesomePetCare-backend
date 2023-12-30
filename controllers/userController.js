const User = require("../model/User");

const getAllUser = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -refreshToken")
            .populate("pets")
            .exec();
        if (!users) return res.status(204).json({ message: "No users found" });
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUser = async (req, res) => {
    const username = req?.params?.username;
    if (!username)
        return res.status(400).message({ message: "Username required" });

    const foundUser = await User.findOne({ username })
        .select("-password -refreshToken")
        .populate("pets")
        .exec();
    if (!foundUser) return res.status(404).json({ message: "User not found" });
    res.json(foundUser);
};

module.exports = { getAllUser, getUser };
