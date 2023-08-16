require('dotenv').config();
const Profile = require('./model/profile');
const User = require('./model/user');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const profile = await Profile.find({ roll: req.student.id });
        if (!profile) {
            return res.json({ message: 'No profile found' });
        }
        res.json(profile);
    } catch (error) {
        return res.json({ message: error })
    }
})

app.post('/refresh', authenticateToken, async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const user = await User.find({refreshToken:refreshToken});
    if(!user){
        return res.sendStatus(401); 
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, student) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign({ id: student.id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'50s'});
        res.json({ accessToken: accessToken });
    });
});

app.delete('/logout', authenticateToken, async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(401);
        }
        const user = await User.findOneAndUpdate(
            { refreshToken: refreshToken },
            { $unset: { refreshToken: 1 } }, // Remove the refreshToken field
            { new: true } // To return the updated user
        );

        if (!user) {
            return res.sendStatus(401);
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { name, mobile, dob, blood, studentID, password } = req.body;
        if (!studentID || !password || !name || !mobile || !dob || !blood) {
            return res.json({ message: 'please enter all the details' })
        }
        const userExist = await User.findOne({ studentID: req.body.studentID });
        if (userExist) {
            return res.json({ message: `user already exists with the given student ID ${req.body.studentID}` })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User();
        user.password = hashedPassword;
        user.studentID = studentID;
        await user.save();

        const profile = new Profile();
        profile.roll = studentID;
        profile.name = name;
        profile.mobile = mobile;
        profile.dob = dob;
        profile.blood = studentID;
        await profile.save();

        // now authorize the user with a token 
        const student = { id: studentID }; // this is the payload 
        const accessToken = jwt.sign(student, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'50s'});
        const refreshToken = jwt.sign({ id: studentID }, process.env.REFRESH_TOKEN_SECRET);
        user.refreshToken = refreshToken;
        await user.save();
        res.json({ accessToken: accessToken });
    } catch (error) {
        return res.json({ message: error });
    }
})

app.post('/login', async (req, res) => {
    try {
        const { studentID, password } = req.body;
        if (!studentID || !password) {
            return res.json({ message: 'please enter all the details' });
        }
        const userExist = await User.findOne({ studentID: req.body.studentID });
        if (!userExist) {
            return res.json({ message: 'Invalid student ID' });
        }
        const isPasswordMatched = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatched) {
            return res.json({ message: 'wrong credentials' });
        }
        const student = { id: studentID };
        const accessToken = jwt.sign(student, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'50s'});
        const refreshToken = jwt.sign(student, process.env.REFRESH_TOKEN_SECRET);
        userExist.refreshToken = refreshToken;
        await userExist.save();
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        res.json({ message: error });
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, student) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.student = student;
        next();
    });
}

async function start() {
    try {
        await connectDB(process.env.MONGO_URI)
    } catch (error) {
        console.log(error);
    }
}
start();

app.listen(3000);
