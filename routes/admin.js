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
// student logs
router.get("/student/details", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/student-logs.html"));
});

// student management
router.get("/student/add", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/student-management.html"));
});

// Student admission Detail/management
router.post("/api/student/addDetail", async (req, res) => {
  try {
    const {
      Fname,
      Lname,
      dob,
      email,
      contact,
      address,
      admission_date,
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
      admission_date,
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
      AdmissionDate: admission_date,
      Course,
      Semester: Sem,
    });

    await studentDetail.save();
    res.status(200).json({ success: true, message: "Data added successfully" });
  } catch (error) {
    console.error("Error saving data: ", error);
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        success: false,
        message: `Duplicate key error: ${Object.keys(error.keyPattern).join(", ")} already exists.`,
      });
    } else {
      // Handle other errors
      res.status(500).json({
        success: false,
        message: `Error saving data: ${error.message}`,
      });
    }
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

// find student data using studentID
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

// Update student data
router.put("/api/students/update", async (req, res) => {
  const {
    studentId,
    firstName,
    lastName,
    dob,
    email,
    contact,
    address,
    admission_date,
    course,
    sem,
  } = req.body;

  try {
    const updatedStudent = await StudentDetail.findOneAndUpdate(
      { studentId },
      {
        Fname: firstName,
        Lname: lastName,
        DOB: dob,
        Email: email,
        Contact: contact,
        Address: address,
        AdmissionDate: admission_date,
        Course: course,
        Semester: sem,
      },
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.json({
      success: true,
      message: "Student details updated",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

module.exports = router;
