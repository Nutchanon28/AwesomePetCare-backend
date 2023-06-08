const User = require("../model/User");
const Pet = require("../model/Pet");

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
        "image", // TODO: add an endpoint for image.
    ];
    const { description, ...fields } = req.body;
    const hasAllRequiredFields = requiredFields.every(
        (field) => field in fields
    );

    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();

    if (!hasAllRequiredFields)
        return res.status(400).json({ error: "Missing required fields" });

    try {
        const result = await Pet.create({
            ...fields,
            ownerId: foundUser._id,
            description,
        });
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

module.exports = { getUserPets, createPet };
