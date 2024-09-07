const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const router = express.Router();
const bodyParser = require("body-parser");
const { admin, faculty, student, StudentDetail } = require("../models/user.js");
// dash
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/admin-dashboard.html"));
});

router.get("/student/details", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/student-logs.html"));
});

router.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/student-management.html"));
});

// Student admission Detail/management

router.post("/student/detail", async (req, res) => {
  try {
    const {
      Fname,
      Lname,
      dob,
      email,
      contact,
      address,
      addmission_date,
      Course,
      Sem,
    } = req.body;
    console.log(req.body);
    console.log(
      Fname,
      Lname,
      dob,
      email,
      contact,
      address,
      addmission_date,
      Course,
      Sem,
    );

    const studentDetail = new StudentDetail({
      Fname,
      Lname,
      DOB: dob,
      Email: email,
      Contact: contact,
      Address: address,
      AdmissionDate: addmission_date,
      Course,
      Semester: Sem,
    });

    await studentDetail.save();
    res.send(`Data added successfully`);
  } catch (error) {
    res.status(500).send(`Error saving data: ${error.message}`);
  }
});

// searching using studentId
router.get("/api/student-logs", async (req, res) => {
  try {
    const query = req.query.q || "";
    const regex = new RegExp(query, "i");

    const users = await StudentDetail.aggregate([
      {
        $match: {
          studentId: { $regex: regex },
        },
      },
      {
        $addFields: {
          numericPart: { $toInt: { $substr: ["$studentId", 2, -1] } },
        },
      },
      {
        $sort: { numericPart: 1 },
      },
      {
        $project: { studentId: 1, _id: 0 },
      },
      {
        $limit: 10,
      },
    ]);

    console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching autocomplete results");
  }
});

router.get("/api/student-logs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await StudentDetail.findOne({ studentId: id });
    // console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
