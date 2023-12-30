const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

router.route("/").get(ticketController.getUserTickets);

router.route("/admin").get(ticketController.getAllTicket);

module.exports = router;
