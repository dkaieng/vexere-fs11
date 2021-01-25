const express = require("express");
const router = express.Router();

const Station = require("../models/station");
const Trip = require("../models/trip");

router.post("/", async (req, res) => {
  const { name, address, province, code, status } = req.body;

  try {
    const foundStation = await Station.findOne({ code });

    if (foundStation)
      return res.status(400).send({ message: "Station already existed!!" });

    const newStation = new Station({
      name,
      address,
      province,
      code,
      status,
    });

    const result = await newStation.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
});
router.get("/", async (req, res) => {
  try {
    const { code } = req.query;
    const foundStation = await Station.findOne({ code });
    if (!foundStation)
      return res.status(400).send({ message: "Không tìm thấy bến xe" });
    res.send(foundStation);
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({ message: "Something was wrong" });
  }
});

router.patch("/", async (req, res) => {
  try {
    const { name, address, code, province } = req.body;
    const foundStation = await Station.findOne({ code });
    if (!foundStation)
      return res.status(400).send({ message: "Bến không tồn tại" });
    foundStation.name = name;
    foundStation.address = address;
    foundStation.province = province;
    const result = await foundStation.save();
    res.send(result);
  } catch (err) {
    return res.status(500).send({ message: "Something was wrong" });
  }
});

router.delete("/", async (req, res) => {
  const { code } = req.query;
  try {
    const foundStation = await Station.findOne({ code });
    console.log("foundStation", foundStation);
    if (!foundStation)
      return res.status(400).send({ message: "Không tìm thấy bến xe để xoá" });
    if (foundStation && foundStation.status == "inactive")
      return res.status(400).send({ message: "Bến xe đã được xoá" });
    if (foundStation && foundStation.status == "active") {
      const StationID = foundStation._id;
      console.log("StationID", StationID);
      const checkIDStationinTrip = await Trip.find({
        $or: [
          { departurePlace: { $in: [StationID] } },
          { arrivalPlace: { $in: [StationID] } },
        ],
      });
      console.log("checkIDStationinTrip", checkIDStationinTrip);
      if (checkIDStationinTrip.length !== 0)
        return res.status(400).send({
          message: "Không thể xoá bến xe vì có chuyến xe đang chạy đến bến",
        });
      foundStation.status = "inactive";
      const result = await foundStation.save();
      res.send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
