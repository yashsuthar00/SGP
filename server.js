const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { error } = require("console");
const cors = require("cors");
const path = require("path");
const Swal = require("sweetalert2");
const { admin, faculty, student } = require("./models/user");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

const PORT = 3000;
// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  var { userRole } = req.body;
  // console.log(req.body);
  try {
    let User;
    if (userRole === "admin") {
      User = admin;
    } else if (userRole === "faculty") {
      User = faculty;
    } else if (userRole === "student") {
      User = student;
    } else {
      return res.status(400).send("Invalid role");
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign(
      { userId: user._id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect(`/${userRole}/dashboard`);
  } catch (error) {
    res.status(400).send("Error signing in");
  }
});

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
}

// role login
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/admin/admin-login.html"));
});

app.get("/faculty/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/faculty/faculty-login.html"));
});

app.get("/student/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/student/student-login.html"));
});

// role routes
const adminRouter = require("./routes/admin");
app.use("/admin", authenticateToken, authorizeRole("admin"), adminRouter);

const facultyRouter = require("./routes/faculty");
app.use("/faculty", authenticateToken, authorizeRole("faculty"), facultyRouter);

const studentRouter = require("./routes/student");
app.use("/student", authenticateToken, authorizeRole("student"), studentRouter);

app.post("/logout", (req, res, userRole) => {
  res.clearCookie("jwt");
  res.clearCookie("role");
  res.redirect(`/${userRole}/login`);
});

app.listen(PORT, () => {
  console.log(`server running on https://localhost:3000`);
});
