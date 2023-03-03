const mongoose = require("mongoose");
const config = async () => {
  mongoose
    .connect(process.env.mongo)
    .then(() => {
      console.log("connected mongoose");
    })
    .catch((err) => {
      console.log("OH NO MONGO CONNECTION ERROR!!!!");
      console.log(err);
    });
};
module.exports = config;
