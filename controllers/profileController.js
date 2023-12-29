const User = require("../model/User");

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream } = require("../s3");

const getProfile = async (req, res) => {
    const username = req.username;
    const foundUser = await User.findOne({ username })
        .select("-password -refreshToken")
        .populate("pets")
        .exec();

    // const user = {
    //     username: foundUser?.username,
    //     name: foundUser?.name,
    //     avatarFileKey: foundUser?.avatarFileKey,
    // };
    console.log(foundUser);
    res.status(200).json(foundUser);
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

const getAvatar = async (req, res) => {
    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser.avatarFileKey) return res.sendStatus(404);

    const readStream = getFileStream(foundUser.avatarFileKey);
    readStream.pipe(res);
};

const updateAvatar = async (req, res) => {
    const file = req.file;

    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();

    const uploadResult = await uploadFile(file);
    await unlinkFile(file.path);
    console.log(uploadResult);

    foundUser.avatarFileKey = uploadResult.Key;
    const result = await foundUser.save();
    console.log(result);

    res.json(result);
};

module.exports = { getProfile, updateProfile, getAvatar, updateAvatar };
