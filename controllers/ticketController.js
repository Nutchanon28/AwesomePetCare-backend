const User = require("../model/User");
const Ticket = require("../model/Ticket");

const getUserTickets = async (req, res) => {
    const username = req.username;
    const foundUser = await User.findOne({ username }).exec();

    const tickets = await Ticket.find({ userId: foundUser._id })
        .populate("petsId")
        .exec();
    if (!tickets) return res.status(204).json({ message: "No tickets found." });
    res.json(tickets);
};

const getAllTicket = async (req, res) => {
    const tickets = await Ticket.find()
        .populate("userId")
        .populate("petsId")
        .exec();
    if (!tickets) return res.status(204).json({ message: "No tickets found." });
    console.log(tickets)
    res.json(tickets);
};

module.exports = { getUserTickets, getAllTicket };
