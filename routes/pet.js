const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
    .route("/")
    .get(petController.getUserPets)
    .post(upload.single("image"), petController.createPet);

router.route("/:id").put(upload.single("image"), petController.updatePet);

module.exports = router;
