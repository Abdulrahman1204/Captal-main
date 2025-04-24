const express = require("express");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middlewares/Error");
const cors = require("cors");
const connectToDb = require("./config/connectToDB");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
connectToDb();

//Init App
const app = express();

//Cors Policy
app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);

//Apply Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/captal/auth", require("./routes/auth"));
app.use(
  "/api/captal/orderQualification",
  require("./routes/orderQualification")
);
app.use("/api/captal/orderFinance", require("./routes/orderFinance"));
app.use("/api/captal/user", require("./routes/user"));
app.use("/api/captal/material", require("./routes/matrials"));
app.use("/api/captal/orderMaterial", require("./routes/orderMaterial"));
app.use("/api/captal/classficationMaterial",require("./routes/classficationMaterial"));
app.use("/api/captal/classficationMaterialSon",require("./routes/classficationMaterialSon"));
app.use("/api/captal/recourseUserOrder", require("./routes/recourseUser"));
// app.use("/api/captal/", require("./routes/sendEmail"));
app.get("/api/captal/get-cookies", (req, res) => {
  const myCookieToken = req.cookies.token;

  try {
    // Decode the token without verifying (if you don't have the secret)
    const decoded = jwt.decode(myCookieToken);

    // Or verify the token if you have the secret
    // const decoded = jwt.verify(myCookieToken, 'your-secret-key');

    const role = decoded?.role;
    const id = decoded?.id; // Assuming the role is stored in the 'role' claim
    // Assuming the role is stored in the 'role' claim

    res.json({
      cookieValue: myCookieToken,
      role: role || "No role found in token",
      id: id || "No Id found in Token",
    });
  } catch (error) {
    res.status(400).json({
      error: "Invalid token",
      details: error.message,
    });
  }
});

// Error Handler middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () =>
  console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`)
);
