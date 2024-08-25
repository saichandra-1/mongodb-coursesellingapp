const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('your mongodb string');

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    email:String,
    password:String,
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    email:String,
    password:String,
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]

});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    Title:String,
    Description:String,
    Imagelink:String,
    Price:Number
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}
