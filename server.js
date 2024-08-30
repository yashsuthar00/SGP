const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { error } = require('console');
const cors = require('cors');
const path = require('path');
const { admin, faculty, student, StudentDetail } = require('./models/user');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser()); 


const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


// Student admission Detail/management

app.post('/student/detail', async (req, res) => {
    try {
        const { Fname, Lname, dob, email, contact, address, addmission_date, Course, Sem } = req.body;
        console.log(req.body);
        console.log(Fname, Lname, dob, email, contact, address, addmission_date, Course, Sem);

        const studentDetail = new StudentDetail({ 
            Fname,
            Lname,
            DOB : dob,
            Email : email,
            Contact : contact,
            Address : address,
            AdmissionDate : addmission_date,
            Course,
            Semester : Sem,
        });

        await studentDetail.save();
        res.send(`Data added successfully`)
    } catch (error) {
        res.status(500).send(`Error saving data: ${error.message}`);
    }
});


// get student-logs
app.get('/api/student-logs/:id', async (req,res) => {
    const { id } = req.params;
    try {
        const data = await StudentDetail.findOne({Fname: id });
        // console.log(data);
        res.json(data);
    } catch (error) {
        res.status(500).send(err.message);
    }
});

app.get('/api/student-logs', async (req, res) => {
    try {
        const query = req.query.q || '';
        const users = await StudentDetail.find({ Fname: { $regex: `^${query}`, $options: 'i' } }, {Fname:1, _id:0}).limit(10);
        console.log(users);
        res.json(users);
    } catch (err) {
        res.status(500).send('Error fetching autocomplete results');
    }
});













app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    var { userRole } = req.body;
    // console.log(req.body);
    try {
        let User;
        if (userRole === 'admin') {
            User = admin;
        } else if (userRole === 'faculty') {
            User = faculty;
        } else if (userRole === 'student') {
            User = student;
        } else {
            return res.status(400).send('Invalid role');
        }
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Invalid credentials'); 
        }
        const token = jwt.sign({ userId: user._id, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); 
        res.redirect(`/${userRole}/dashboard`); 
    } catch (error) {
        res.status(400).send('Error signing in');
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

app.post('/logout', (req, res, userRole) => {
    res.clearCookie('jwt');
    res.clearCookie('role');
    res.redirect(`/${userRole}/login`);
});








// Admin
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/admin-login.html'))
})

app.get('/admin/dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/admin-dashboard.html'))
})

app.get('/student', authenticateToken, authorizeRole('admin'), (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/admin/student-management.html'))
})

app.get('/student/details', authenticateToken, authorizeRole('admin'), (req,res) => {
    res.sendFile(path.join(__dirname, '/public/admin/student-logs.html'))
})

// faculty
app.get('/faculty/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/faculty/faculty-login.html'))
})

app.get('/faculty/dashboard', authenticateToken, authorizeRole('faculty'), (req, res) => {
    res.sendFile(path.join(__dirname, '/public/faculty/faculty-dashboard.html'))
})

// student
app.get('/student/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/student/student-login.html'))
})

app.get('/student/dashboard', authenticateToken, authorizeRole('student'), (req, res) => {
    res.sendFile(path.join(__dirname, '/public/student/student-dashboard.html'))
})



app.listen(PORT, () => {
    console.log(`server running on https://localhost:3000`)
})