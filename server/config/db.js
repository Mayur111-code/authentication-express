// const mongoose = require('mongoose');

// const connectDB = ()=>{
//     try {
//        const conn = await  mongoose.connect(`${process.env.MONGODB_URL}`)
//        console.log("Connected with data based")
//     } catch (error) {
//         console.log(error,message)
//         process.exit(1);
//     }
// }

// module.exports = connectDB

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("mongo db is connected !...");
  } catch (error) {
    console.log("db is failed to connect", error);
    process.exit(1);
  }
};

module.exports = connectDB;
