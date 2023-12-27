const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

router.route("/").get(ticketController.getUserTickets);

module.exports = router;
