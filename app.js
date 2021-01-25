const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
//module cua nodejs
const path = require("path");
const passport = require("passport");
const passportStrategy = require("passport-facebook-token");
require("./db/connect");

const PORT = config.get("port");
const tripRouter = require("./routers/trip");
const branchRouter = require("./routers/branch");
const carRouter = require("./routers/car");
const stationRouter = require("./routers/station");
const authRouter = require("./routers/auth");
const uploadRouter = require("./routers/upload");
const ticketRouter = require("./routers/ticket");

const app = express();
passport.use(
  "facebookToken",
  new passportStrategy(
    {
      clientID: "849986432462828",
      clientSecret: "eb5ff3d6a86f8d800197c41dc1a154be",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    }
  )
);

/**
 * TODO
 *  .CRUD Branch
 *  .CRUD Car
 *  .CRUD Station
 *  .CRUD Trip
 *  .signup, signin, jwt, track tokens , authorization, logout ,log out all
 *  .Booking Ticket
 *  .Refactor - mvc, router,
 *  .Giới thiệu buffer - stream
 *  .Upload file - filter type,limit size, serve static file
 *  .Send email
 *  .Chat module
 *
 */

//closure

const imaagesFolderPath = path.join(__dirname, "images");
app.use(bodyParser.json());
app.use("/images", express.static(imaagesFolderPath));

app.use(authRouter);
app.use(tripRouter);
app.use(branchRouter);
app.use("/car", carRouter);
app.use("/station", stationRouter);
app.use(branchRouter);
app.use(uploadRouter);
app.use("/ticket", ticketRouter);
app.post(
  "/login/facebook",
  passport.authenticate("facebookToken", { session: false }),
  async (req, res) => {
    console.log("aaaaa");
  }
);

app.listen(PORT, () => {
  console.log("listening.....");
});
