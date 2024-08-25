const { Router } = require("express");
const jwt = require('jsonwebtoken');
const adminMiddleware = require("../middleware/admin");
const { Admin,Course } = require("../db");
const router = Router();

const jwtPassword = require("../config");
const { z } = require("zod");

const emailschema = z.string().email();
const passwordschema=z.string();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the email
    emailschema.parse(email);
    passwordschema.parse(password);

    // Create the user
    await Admin.create({ email, password });

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid email" });
  }
});

router.post("/signin",async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const flag=  await Admin.find({email,password});
    if(flag){
        const token=jwt.sign({email},jwtPassword);
        res.json({token})
    }else{
        res.status(411).json({message:"Incorre email or pass"})
    }
})

router.post('/courses', adminMiddleware,async (req, res) => {
    // Implement course creation logic
        await Course.create({
            Title:req.body.Title,
            Description:req.body.Description,
            Imagelink:req.body.Imagelink,
            Price:req.body.Price
        })
    res.status(200).json({ message: 'Course created successfully', courseId: "new course id" })
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({});

    res.json({
        courses: response
    })


});

module.exports = router;