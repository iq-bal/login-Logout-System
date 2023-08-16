const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    studentID: {
        type: String, 
        required: true 
    },
    password: {
        type: String, 
        required: true
    },
    refreshToken:{
        type: String
    }
})

module.exports = mongoose.model('User', userSchema);
