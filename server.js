const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./models/User')
const { error } = require('console')
const path = require('path')
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
    // console.log(req.body);
    try {
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
    res.sendFile(path.join(__dirname, '/public/admin/adminLogin.html'))
})
app.get('/faculty-login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/faculty/facultyLogin.html'))
})
app.get('/student-login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/student/studentLogin.html'))
})

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin/dashboard.html'))
})


app.listen(PORT, () => {
    console.log(`server running on https://localhost:3000`)
})