const express = require("express");
const path = require("path");
require("dotenv").config();
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/student/student-dashboard.html"),
  );
});

module.exports = router;
