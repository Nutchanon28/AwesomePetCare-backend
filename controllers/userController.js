const User = require("../model/User");

const getAllUser = async (req, res) => {
    const users = await User.find().exec();
    console.log(users);
    res.json(users);
};

module.exports = { getAllUser };
