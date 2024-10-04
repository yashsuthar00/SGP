const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Login Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// subject Schema
const subjectDetailSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true, unique: true },
  subjectShortName: { type: String, required: true, unique: true },
  departmentId: { type: String, required: true },
  subjectCreditPoints: { type: Number, required: true },
  offeredSemester: { type: Number, required: true },
})

// Student addmission Schema
const StudentDetailSchema = new mongoose.Schema({
  Fname: { type: String, required: true },
  Lname: { type: String, required: true },
  DOB: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Contact: { type: String, required: true },
  Address: { type: String, required: true },
  AdmissionDate: { type: String, required: true },
  Course: { type: String, required: true },
  Semester: { type: String, required: true },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'department' }
});

// Faculty detail Schema
const FacultyDetailSchema = new mongoose.Schema({
  Fname: { type: String, required: true },
  Lname: { type: String, required: true },
  DOB: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Contact: { type: String, required: true },
  Address: { type: String, required: true },
  joinDate: { type: String, required: true },
  assignedDepartment: { type: String, required: true },
});

const StudentTimetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  Time: { type: String, required: true },
  class_id: { type: String, required: true },
  LH: { type: Number, required: true },
  LAB: { type: String, required: true },
  Batch: { type: String, required: true },
  faculty_id: { type: String, required: true },
  subject_id: { type: String, required: true },
  dayTime: { type: String, required: true },
  lectureDuration: { type: String, required: true },
});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: String, required: true }, 
  student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentDetail' }],
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'department' },
})

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentId: { type: String, required: true },
});

// search id to find StudentData

const admin = mongoose.model("admin", UserSchema, "adminLogin");
const faculty = mongoose.model("faculty", UserSchema, "facultyLogin");
const student = mongoose.model("student", UserSchema, "studentLogin");
const subjectDetail = mongoose.model("subjectDetail", subjectDetailSchema, "subjects");
const facultyDetail = mongoose.model("facultyDetail", FacultyDetailSchema, "facultyDetail");
const classDetail = mongoose.model("classDetail", classSchema, "classDetail");
const department = mongoose.model(
  "department",
  DepartmentSchema,
  "departments",
);
const studentTimetable = mongoose.model(
  "studentTimetable",
  StudentTimetableSchema,
  "timetables",
);

const StudentDetail = mongoose.model(
  "StudentDetail",
  StudentDetailSchema,
  "studentDetail",
);

module.exports = {
  admin,
  faculty,
  student,
  StudentDetail,
  facultyDetail,
  studentTimetable,
  department,
  subjectDetail,
  classDetail,
};
