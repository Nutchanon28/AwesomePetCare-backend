const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");

router.route("/").get(verifyRoles(ROLES_LIST.Admin), userController.getAllUser);

module.exports = router;
