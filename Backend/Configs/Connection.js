const mongoose = require('mongoose');
require('dotenv').config();

const conn = ()=>{
    try {
        if(mongoose.connect(process.env.MONGO_URI)){
            console.log('mongoose connected');
        } else{
            console.log('invalid MONGO URI');
        }
        
        
    } catch (error) {
        console.log('mongoose connection error')
        
    }
    
}

module.exports = {conn};