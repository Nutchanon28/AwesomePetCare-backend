const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        require: true,
        ref: "User",
    },
    petsId: [
        {
            type: Schema.ObjectId,
            require: true,
            ref: "Pet",
        },
    ],
    service: {
        type: String,
        required: true,
    },
    datetime: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // status: unpaid, scheduled, pending, completed, canceled
    status: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Ticket", ticketSchema);
