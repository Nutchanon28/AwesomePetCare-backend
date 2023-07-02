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

const updatePet = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).message({ message: "Pet ID required" });

    const foundPet = await Pet.findOne({ _id: req.params.id }).exec();
    if (!foundPet) {
        return res
            .status(404)
            .json({ message: `No pet matches ID ${req.params.id}.` });
    }
    if (req?.body?.name) foundPet.name = req.body.name;
    if (req?.body?.type) foundPet.type = req.body.type;
    if (req?.body?.breed) foundPet.breed = req.body.breed;
    if (req?.body?.foodAllergies)
        foundPet.foodAllergies = req.body.foodAllergies;
    if (req?.body?.congenitalDisease)
        foundPet.congenitalDisease = req.body.congenitalDisease;
    if (req?.file) {
        const uploadResult = await uploadFile(req.file);
        await unlinkFile(req.file.path);
        foundPet.image = uploadResult.Key;
        console.log(uploadResult);
    }

    const result = await foundPet.save();
    console.log(foundPet);
    res.json(result);
};

module.exports = { getUserPets, createPet, updatePet };