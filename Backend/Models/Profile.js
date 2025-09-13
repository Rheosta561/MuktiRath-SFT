const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name : {
        type : String ,

    },
    bloodGroup: {
      type: String,

      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // restricts to valid blood groups
    },
    healthCondition: {
      type: String,

    },
     enrolledCourse: [{           
      type: mongoose.Types.ObjectId,
      ref: 'Course'
    }],
    otherHealthCondition: {
      type: String,
      default: null,
    },
    interests: {
      type: [String],

    },
    aspiration: {
      type: String,

    },
    shortStory: {
      type: String,
      maxlength: 1000, 
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    recommendedCourses : [
      {type : mongoose.Types.ObjectId ,
        ref : 'Course'
      }
    ],

    whatsappGroup : {
      type:String 

    }

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);


