const express = require("express");
const router = express.Router();

const Ticket = require("../models/ticket");
const User = require("../models/user");
const Trip = require("../models/trip");

router.post("/", async (req, res) => {
  const { userID, tripID, seats } = req.body;
  const foundTicketinUser = User.findById(userID);
});

module.exports = router;
