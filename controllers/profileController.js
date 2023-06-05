const User = require("../model/User");

const getProfile = async (req, res) => {
    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();
    const user = {
        username: foundUser?.username,
        name: foundUser?.name,
    };
    res.status(200).json({ user });
};

const updateProfile = async (req, res) => {
    const { name } = req.body;
    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();

    if (name) foundUser.name = name;

    const result = await foundUser.save();
    console.log(result);
    res.json(result);
};

module.exports = { getProfile, updateProfile };
