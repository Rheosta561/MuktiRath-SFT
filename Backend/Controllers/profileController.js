
const Profile = require('../Models/Profile');
const User = require('../Models/User');


const updateProfile = async (req, res) => {
  try {
    const { id } = req.body; // profile id from route
    const updateData = req.body; // updated profile fields

    // Find profile by ID and update
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};
const createProfile = async (req, res) => {
  try {
    const {
      // name,
      // bloodGroup,
      // healthCondition,
      // otherHealthCondition,
      // interests,
      // aspiration,
      // shortStory,
      coordinates,
      userId 
    } = req.body;

    // 1. Create new profile
    const newProfile = new Profile({
      // name,
      // bloodGroup,
      // healthCondition,
      // otherHealthCondition,
      // interests,
      // aspiration,
      // shortStory,
      coordinates,
    });

    await newProfile.save();

    // 2. Assign profile _id to user
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { profile: newProfile._id },
      { new: true, upsert: true }
    );

    res.status(201).json({ 
      message: "Profile created successfully", 
      profile: newProfile,
      user 
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



const updateProfileWithNumber = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log('Phone:', phone);

    // Find user and populate profile as plain object
    const userFromNumber = await User.findOne({ phone }).populate({
      path: 'profile',
      options: { lean: true }
    });

    if (!userFromNumber) {
      return res.status(400).json({ message: "No Such User Exists" });
    }

    const foundProfile = userFromNumber.profile;

    if (!foundProfile) {
      return res.status(400).json({ message: "No Profile exists for the user" });
    }

    const {
      name,
      bloodGroup,
      healthCondition,
      otherHealthCondition,
      interests,
      aspiration,
      shortStory,
      groupUrl ,
    } = req.body;

    // Update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: foundProfile._id },
      {
        name,
        bloodGroup,
        healthCondition,
        otherHealthCondition,
        interests,
        aspiration,
        shortStory,
        groupUrl
      },
      { new: true, lean: true } // return updated doc as plain object
    );

    return res.status(200).json({ profile: updatedProfile, success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = updateProfileWithNumber;



module.exports = { updateProfile , createProfile , updateProfileWithNumber};
