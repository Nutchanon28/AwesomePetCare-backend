const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
    .route("/")
    .get(profileController.getProfile)
    .put(profileController.updateProfile);

router
    .route("/avatar")
    .get(profileController.getAvatar)
    .put(upload.single("avatar"), profileController.updateAvatar);

module.exports = router;
