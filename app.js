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

// Init App
const app = express();

//Cors Policy
app.use(
  cors({
<<<<<<< HEAD
    origin: ["http://localhost:5173", "https://captalsa.com"],
=======
    origin: ["http://localhost:5173","https://captalsa.com"],
>>>>>>> 3eb9d58033d06d219c6bd5ad0581430f0d7e722c
    credentials: true,
  })
);

// Apply Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/captal/auth", require("./routes/auth"));
app.use("/api/captal/orderQualification", require("./routes/orderQualification"));
app.use("/api/captal/orderFinance", require("./routes/orderFinance"));
app.use("/api/captal/user", require("./routes/user"));
app.use("/api/captal/material", require("./routes/matrials"));
app.use("/api/captal/orderMaterial", require("./routes/orderMaterial"));
<<<<<<< HEAD
app.use(
  "/api/captal/classficationMaterial",
  require("./routes/classficationMaterial")
);
app.use(
  "/api/captal/classficationMaterialSon",
  require("./routes/classficationMaterialSon")
);
app.use("/api/captal/recourseUserOrder", require("./routes/recourseUser"));

=======
app.use("/api/captal/classficationMaterial", require("./routes/classficationMaterial"));
app.use("/api/captal/classficationMaterialSon", require("./routes/classficationMaterialSon"));
app.use("/api/captal/recourseUserOrder", require("./routes/recourseUser"));

// Special Route for Cookies
>>>>>>> 3eb9d58033d06d219c6bd5ad0581430f0d7e722c
app.get("/api/captal/get-cookies", (req, res) => {
  const myCookieToken = req.cookies.token;

  try {
    const decoded = jwt.decode(myCookieToken);
<<<<<<< HEAD

=======
>>>>>>> 3eb9d58033d06d219c6bd5ad0581430f0d7e722c
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

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// SSL Certificates
const sslOptions = {
<<<<<<< HEAD
  key: fs.readFileSync("/etc/letsencrypt/live/captalsa.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/captalsa.com/fullchain.pem"),
=======
  key: fs.readFileSync('/etc/letsencrypt/live/captalsa.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/captalsa.com/fullchain.pem'),
>>>>>>> 3eb9d58033d06d219c6bd5ad0581430f0d7e722c
};

// Start HTTPS Server
const PORT = process.env.PORT || 8000;
https.createServer(sslOptions, app).listen(PORT, () => {
<<<<<<< HEAD
  console.log(
    `🚀 HTTPS server is running on https://srv719334.hstgr.cloud:${PORT}`
  );
=======
  console.log(`🚀 HTTPS server is running on https://srv719334.hstgr.cloud:${PORT}`);
>>>>>>> 3eb9d58033d06d219c6bd5ad0581430f0d7e722c
});
