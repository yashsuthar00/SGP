const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const router = express.Router();
const bodyParser = require("body-parser");
const {
  StudentDetail,
  studentTimetable,
  newStudentTimetable,
  department,
  subjectDetail,
  facultyDetail,
  classDetail,
} = require("../models/user.js");

// dash
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/admin-dashboard.html"));
});

// classes management
router.get("/classes", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/class-management.html"));
});

// student logs
router.get("/student/details", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/student-logs.html"));
});

// student management
router.get("/student/add", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/student-management.html"));
});

// student timetable
router.get("/student/timetable", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/student-timetable.html"));
});

// student new timetable
router.get("/student/timetable/new", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/admin/student-new-timetable.html"),
  );
});
// subject management
router.get("/subjects", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/subject-management.html"));
});

// Faculty management
router.get("/faculty/add", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/faculty-management.html"));
});

router.get("/api/departments", async (req, res) => {
  try {
    const Department = await department.find({}, { departmentId: 1, name: 1 });
    res.json(Department);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get('/api/batches/:departmentId', async (req, res) => {
  const batches = await StudentDetail.find({ department_id: req.params.departmentId });
  res.json(batches);
});

// Route to save divisions
router.post('/divisions', async (req, res) => {
  const divisions = req.body.divisions;

  try {
    // Check if the division already exists for the same department and batch
    for (const division of divisions) {
      const existingDivision = await classDetail.findOne({
        name: division.name,
        department_id: division.department_id,
        batch: division.batch
      });

      if (existingDivision) {
        return res.status(400).json({ message: `Division ${division.name} already exists for batch ${division.batch}` });
      }
    }

    // If no duplicates, insert the new divisions
    await classDetail.insertMany(divisions);
    res.status(201).json({ message: 'Divisions created successfully' });
  } catch (error) {
    console.error('Error creating divisions:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});


// Route to get divisions with students
router.get('/students/:departmentId/:batch', async (req, res) => {
  const { departmentId, batch } = req.params;

  try {
    const students = await StudentDetail.find({
      department_id: departmentId,
      Batch: batch,
    });

    // Return only the _id field of each student
    const studentIds = students.map(student => student._id);
    res.json(studentIds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/class/new", async (req, res) => {
  try{
    const { class_id } = req.body;
    console.log(class_id);

    const newData = {
      name : class_id,
    }

    const classes = new classDetail (newData);

    await classes.save();
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

router.get("/subject/data", async (req, res) => {
  try {
    const subjects = await subjectDetail.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data' });
  }});

router.post("/subject/new", async (req,res) => {
  try {
    const { subName, subCode, course, subShortName, subCredit, offeredSemester } = req.body;
    // console.log(req.body);

    const newDocument = {
      subjectName: subName,
      subjectCode: subCode,
      departmentId: course,
      subjectShortName: subShortName,
      subjectCreditPoints: subCredit,
      offeredSemester: offeredSemester,
    };

    const subject = new subjectDetail (newDocument);
    await subject.save();
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

router.post("/api/faculty/addDetail", async (req, res) => {
  try {
    const {
      Fname,
      Lname,
      dob,
      email,
      contact,
      address,
      join_date,
      Course,
    } = req.body;
    console.log(req.body);
    console.log(
      Fname,
      Lname,
      dob,
      email,
      contact,
      address,
      join_date,
      Course,
    );

    const faculty = new facultyDetail({
      Fname,
      Lname,
      DOB: dob,
      Email: email,
      Contact: contact,
      Address: address,
      joinDate: join_date,
      assignedDepartment: Course,
    });

    await faculty.save();
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

// Create New Timetable
router.post("/api/student/timetable/newData", async (req, res) => {
  try {
    const { startTime, endTime, lectureDuration, class_id, semester, schedule } = req.body;
    console.log(req.body);

    const timetable = new newStudentTimetable ({
      startTime, 
      endTime, 
      lectureDuration, 
      class_id, 
      semester,
      schedule
    });
    
    await timetable.save();
    res.status(200).json({ success: true, message: "Data added successfully" });

  } catch (error) {
    console.error(error);
  }
})

router.get("/api/student/timetable/new", async (req, res) => {
  try {
    const Department = await department.find({}, { departmentId: 1, name: 1 });
    res.json(Department);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/api/student/timetable/new/:department", async (req, res) => {
  const { department } = req.params;
  try {
    const timetable = await studentTimetable.find({
      department_id: new mongoose.Types.ObjectId(department),
    });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// router.get("/api/student/timetable/new/:classes", async (req, res) => {
//   const { classes } = req.params;
//   try {
//     const timetable = await studentTimetable.find({
//       department_id: new mongoose.Types.ObjectId(classes),
//     });
//     res.json(timetable);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// });

router.get("/api/student/timetable/:timetableId", async (req, res) => {
  const { timetableId } = req.params;
  try {
    const timetable = await studentTimetable.aggregate([
      {
        $unwind: "$schedule",
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(timetableId), // Corrected ObjectId
        },
      },
      {
        $project: {
          day: "$schedule.day",
          Time: "$schedule.Time",
          _id: 0,
          LH: "$schedule.LH",
          facultyId: "$schedule.faculty_id",
          subjectId: "$schedule.subject_id",
          LAB: "$schedule.LAB",
          Batch: "$schedule.Batch",
        },
      },
    ]);

    const time = await studentTimetable.findOne(
      { _id: new mongoose.Types.ObjectId(timetableId) }, // Corrected ObjectId syntax
      { dayTime: 1, lectureDuration: 1, _id: 0 },
    );

    res.json({ timetable, time });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// router.get("/api/student/timetable/subject", async (req,res) => {

// })

module.exports = router;
