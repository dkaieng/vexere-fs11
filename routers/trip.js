const express = require("express");
const router = express.Router();

const Car = require("../models/car");
const Station = require("../models/station");
const { Seat } = require("../models/seat");
const Trip = require("../models/trip");
const { auth } = require("../helpers/auth");

router.post("/trip", auth(["admin"]), async (req, res) => {
  let {
    departurePlace,
    arrivalPlace,
    startedDate,
    departureTime,
    carId,
    price,
  } = req.body;

  startedDate = startedDate + " 00:00:00";

  try {
    //check stations
    const foundedStations = await Station.find().or([
      { _id: departurePlace },
      { _id: arrivalPlace },
    ]);
    if (foundedStations.length !== 2)
      return res.status(400).send({ message: "Invalid stations" });

    //check car
    const foundedCar = await Car.findById(carId);
    if (!foundedCar) return res.status(400).send({ message: "Invalid car" });

    const seatArr = [];

    for (var i = 0; i < foundedCar.seats; i++) {
      const newSeat = new Seat({
        name: i + 1,
        status: "avaiable",
      });
      seatArr.push(newSeat);
    }
    console.log(startedDate);
    console.log(departureTime);
    const newTrip = new Trip({
      departurePlace,
      arrivalPlace,
      startedDate: startedDate,
      departureTime,
      seats: seatArr,
      car: carId,
      price,
    });

    const result = await newTrip.save();
    console.log(result);
    res.send(result);

    // const seatArr = [...new Array(foundedCar.seats)].map((_, index) => {
    //   return new Seat({
    //     name: index + 1,
    //     status: "avaiable",
    //   });
    // });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.get("/trip", auth(), async (req, res) => {
  let { departure, arrival, date } = req.query;
  date = date + " 00:00:00";

  try {
    const foundedTrips = await Trip.find({
      departurePlace: departure,
      arrivalPlace: arrival,
      startedDate: date,
    }).populate("departurePlace arrivalPlace car", "name address licensePlate");

    res.send(foundedTrips);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});



module.exports = router;
