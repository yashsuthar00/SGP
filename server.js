const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { error } = require('console')
const path = require('path')
const { admin, faculty, student } = require('./models/User')
require('dotenv').config();

const PORT = 3000

const app = express()

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err))

app.use(bodyParser.json())

app.use(express.static('public'))


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
        res.send('User signed in');
    } catch (error) {
        res.status(400).send('Error signing in');
    }
});







app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/admin-login.html'))
})
app.get('/faculty-login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/faculty/faculty-login.html'))
})
app.get('/student-login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/student/student-login.html'))
})

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/admin-dashboard.html'))
})
app.get('/faculty-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/faculty/faculty-dashboard.html'))
})
app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/student/student-dashboard.html'))
})

app.listen(PORT, () => {
    console.log(`server running on https://localhost:3000`)
})