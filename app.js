const express = require("express");
const https = require("https");
const fs = require("fs");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middlewares/Error");
const cors = require("cors");
const connectToDb = require("./config/connectToDB");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Connect to Database
connectToDb();

//Init App
const app = express();

//Cors Policy
app.use(
  cors({
    origin: ["http://localhost:5173", "https://captalsa.com"],
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
app.use(
  "/api/captal/classficationMaterial",
  require("./routes/classficationMaterial")
);
app.use(
  "/api/captal/classficationMaterialSon",
  require("./routes/classficationMaterialSon")
);
app.use("/api/captal/recourseUserOrder", require("./routes/recourseUser"));

app.get("/api/captal/get-cookies", (req, res) => {
  const myCookieToken = req.cookies.token;

  try {
    const decoded = jwt.decode(myCookieToken);

    const role = decoded?.role;
    const id = decoded?.id;

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

// SSL Certificates
const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/captalsa.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/captalsa.com/fullchain.pem"),
};

// Start HTTPS Server
const PORT = process.env.PORT || 8000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(
    `🚀 HTTPS server is running on https://srv719334.hstgr.cloud:${PORT}`
  );
});
