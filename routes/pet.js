const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

router.route("/").get(petController.getUserPets).post(petController.createPet);

module.exports = router;
