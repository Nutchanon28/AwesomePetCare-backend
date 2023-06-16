const User = require("../model/User");
const Pet = require("../model/Pet");

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream } = require("../s3");

const getUserPets = async (req, res) => {
    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();

    const pets = await Pet.find({ ownerId: foundUser._id }).exec();
    if (!pets) return res.status(204).json({ message: "No pets found." });
    res.json(pets);
};

const createPet = async (req, res) => {
    console.log("this activated");
    const requiredFields = [
        "name",
        "type",
        "breed",
        "foodAllergies",
        "congenitalDisease",
    ];
    const image = req.file;
    const { description, ...fields } = req.body;
    const hasAllRequiredFields = requiredFields.every(
        (field) => field in fields
    );

    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();

    const uploadResult = await uploadFile(image);
    await unlinkFile(image.path);
    console.log(uploadResult);

    if (!hasAllRequiredFields || !image)
        return res.status(400).json({ error: "Missing required fields" });

    try {
        const result = await Pet.create({
            ...fields,
            ownerId: foundUser._id,
            image: uploadResult.Key,
            description,
        });
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

module.exports = { getUserPets, createPet };
