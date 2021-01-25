const express = require("express");
const Car = require("../models/car");
const Trip = require("../models/trip");
const router = express.Router();

router.post("/", async (req, res) => {
  const { branchId, licensePlate, seats, status } = req.body;
  try {
    const foundCar = await Car.findOne({ licensePlate });

    if (foundCar)
      return res
        .status(400)
        .send({ message: "License plate already existed!!" });

    const newCar = new Car({
      branch: branchId,
      licensePlate,
      seats,
      status,
    });

    const result = await newCar.save();
    res.send(result);
  } catch (err) {}
});

router.get("/", async (req, res) => {
  try {
    const { licensePlate } = req.query;
    const foundCar = await Car.findOne({ licensePlate });
    if (!foundCar)
      return res
        .status(400)
        .send({ message: "Không tồn tại xe có biển số này" });
    res.send(foundCar);
  } catch (err) {
    return res.status(500).send({ message: "Something was wrong" });
  }
});

router.patch("/", async (req, res) => {
  try {
    const { branch, licensePlate, seats } = req.body;

    const foundCar = await Car.findOne({ licensePlate });
    console.log(foundCar);
    if (!foundCar)
      return res.status(400).send({ message: "Không tim thấy xe" });
    foundCar.branch = branch;
    foundCar.seats = seats;
    const result = await foundCar.save();
    res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something was wrong" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { _id } = req.query;
    console.log("_id", _id);
    const foundCar = await Car.findById(_id);
    console.log("foundCar", foundCar);
    if (!foundCar)
      return res.status(400).send({ message: "Không tìm thấy xe" });
    if (foundCar && foundCar.status == "inactive")
      return res.status(400).send({ message: "Xe này đã xoá rồi" });
    if (foundCar && foundCar.status == "active") {
      const foundTripHaveCar = await Trip.find({
        car: { $in: foundCar._id },
        departureTime: { $gt: new Date() },
      });
      console.log("foundTripHaveCar", foundTripHaveCar);
      if (foundTripHaveCar.length !== 0)
        return res
          .status(400)
          .send({ message: "Xe đang chạy trong chuyến, không thể xoá" });
      foundCar.status = "inactive";
      const result = await foundCar.save();
      res.status(400).send(result);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "Something was wrong" });
  }
});

// router.delete();
module.exports = router;
