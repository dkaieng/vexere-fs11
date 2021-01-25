const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    province: String,
    code: String,
    status: String,
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
