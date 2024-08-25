const { Router } = require("express");
const jwt = require("jsonwebtoken");
const {User,Course}=require("../db");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwtPassword=require("../config");
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
    await User.create({ email, password });

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid email" });
  }
});


router.post("/signin",async(req,res)=>{
        const  email=req.body.email;
        const password= req.body.password;
   const user= await User.find({
        email,
        password 
    })
    if(user){
        const token=jwt.sign({email},jwtPassword);
        res.json({token});
    }else{
        req.status(403).json({message:"invalid input"})
    }

})


router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const response=await Course.find({});
    res.json({courses:response})
});

router.post('/courses/:id', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const id=req.params.id;
    const authorization=req.headers.authorization;
    const words=authorization.split(" ");
    const tok=words[1];
    const decodedToken = jwt.decode(tok);
    const email = decodedToken.email;
    await User.updateOne({
        email:email
    },{
        "$push":{
            purchasedCourses:id
        }
    })
    res.json({
        message: "Purchase complete!"
    })
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const authorization=req.headers.authorization;
    const words=authorization.split(" ");
    const tok=words[1];
    const decodedToken = jwt.decode(tok);
    const email = decodedToken.email;
    const user = await User.findOne({
        email: email
    });
    const response = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });
    res.json({ courses: response });
});


module.exports = router