const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoute = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
connectDB();


app.use(
  cors({
    origin: [
      "http://localhost:5173",          
      "https://authentication-express-zeta.vercel.app" 
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
