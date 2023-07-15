const mongoose = require("mongoose");

const connectProductDB = () => {
  mongoose
    .connect(process.env.MONGO_PASS, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { connectProductDB };
