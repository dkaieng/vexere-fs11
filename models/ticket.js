const mongoose = require("mongoose");

// const seatSchema = require("./seat");

const TicketSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tripID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
  seats: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
  },
});

const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket;
