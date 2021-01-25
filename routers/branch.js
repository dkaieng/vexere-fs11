const express = require("express");
const router = express.Router();

const Branch = require("../models/branch");
const Car = require("../models/car");
const Trip = require("../models/trip");

router.post("/branch", async (req, res) => {
  //check branch

  try {
    const foundedBranch = await Branch.findOne({ code: req.body.code });

    if (foundedBranch) {
      return res.status(400).send({ message: "Branch already exist!!" });
    }

    const newBranch = new Branch({
      name: req.body.name,
      hotline: req.body.hotline,
      code: req.body.code,
      address: req.body.address,
      status: req.body.status,
    });

    const result = await newBranch.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.get("/branch", async (req, res) => {
  try {
    const code = req.query;
    const foundBranch = await Branch.findOne(code);
    if (!foundBranch)
      return res.status(400).send({ message: "Không tìm thấy hãng xe" });
    res.send(foundBranch);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.patch("/branch", async (req, res) => {
  const { name, code, hotline, address, status } = req.body;
  try {
    const foundBranch = await Branch.findOne({ code });
    if (!foundBranch)
      return res.status(400).send({ message: "Không tìm thấy hãng xe" });
    foundBranch.name = name;
    foundBranch.hotline = hotline;
    foundBranch.address = address;
    foundBranch.status = status;
    console.log(foundBranch);
    const result = await foundBranch.save();
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.delete("/branch", async (req, res) => {
  const { code } = req.query;
  try {
    console.log(code);
    const foundBranch = await Branch.findOne({ code });
    console.log("foundBranch", foundBranch);
    if (!foundBranch)
      return res.status(400).send({ message: "Không tìm thấy hãng xe" });
    if (foundBranch && foundBranch.status == "inactive")
      return res.status(400).send({ message: "Hãng xe đã xoá rồi" });

    if (foundBranch && foundBranch.status == "active") {
      const CarsInBrand = await Car.find({ branch: foundBranch._id });
      if (CarsInBrand.length === 0) {
        foundBranch.status = "inactive";
      }
      console.log("CarsInBrand", CarsInBrand);
      const CarIds = CarsInBrand.map((item) => item._id);
      console.log("CarsInBrand ids", CarIds);
      const TripsHaveCarInBrand = await Trip.find({
        car: {
          $in: CarIds,
        },
        departureTime: {
          $gt: new Date(),
        },
      });
      console.log("TripsHaveCarInBrand", TripsHaveCarInBrand);
      if (TripsHaveCarInBrand.length !== 0) {
        return res.status(401).send({
          message: "Không thể xoá hãng xe vì có chuyến đang dùng xe của hãng",
        });
      }
      foundBranch.status = "inactive";
      const result = await foundBranch.save();
      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something was wrong" });
  }

  // if(foundBranch && status)
});
module.exports = router;
