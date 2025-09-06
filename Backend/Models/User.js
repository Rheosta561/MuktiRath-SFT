const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    phone : {
        type: Number 
    },
    password : {
        type : String 
    },
    profile : {
        type : mongoose.Types.ObjectId,
        ref : 'Profile'

    }

});

module.exports = mongoose.model('User ', userSchema);
