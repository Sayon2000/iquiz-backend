const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser')

const { body, validationResult } = require('express-validator');
const User = require('../model/User');
const detailsValidator = require('../middleware/detailsValidator');


//endpoints : 

//Route 1 : endpoint : /api/auth/create (POST ) create a new User : No login required
router.post('/create', [
    body('name', 'Name must be of 5 characters').trim().isLength({ min: 5 }),
    body('email', 'Ente a valid email').isEmail(),
    body('password', ' Password must be of 5 characters').trim().isLength({ min: 5 })

], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, name } = req.body;




    let user = await User.findOne({ email })

    if (user) {
        return res.status(401).json({ success, message: "User with this email already exists" })
    }


    //generating password hash
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    user = await User.create({
        name: name,
        email: email,
        password: hashPass
    })



    //getting the id value corresponding to the document
    let data = {
        id: user.id
    }

    //generating a JWT token using the id of user
    const JWT_SECRET = process.env.JWT_SECRET
    const token = jwt.sign(data, JWT_SECRET)



    success = true;
    res.json({ success, token })
})


//Route 2 : endpoint : /api/auth/login (POST)
router.post('/login', [
    body('password', 'password cannot be null').exists(),
    body('email', 'Enter a valid email').isEmail()
], async(req, res) => {
    try {
        

    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;
    let user = await User.findOne({ email })
    if(!user){
        return res.status(400).json({success , "message" : "Please enter correct credentials to login"})
    }


    let comparePass =await bcrypt.compare(password, user.password);
    console.log(comparePass)
    if(!comparePass){
        return res.status(401).json({success , "message" : "Please enter correct credentials to login"})
    }



    
    //getting the id value corresponding to the document
    let data = {
        id: user.id
    }

    //generating a JWT token using the id of user
    const JWT_SECRET = process.env.JWT_SECRET
    const token = jwt.sign(data, JWT_SECRET)



    success = true;
    res.json({ success, token })


    } catch (error) {
            console.log(error.message)
            res.status(500).send("Internal server error ")
    }



})


//Route 3 : endpoint : /api/auth/getdetails (POST)  : login required
router.get('/getdetails',fetchUser,async(req,res)=>{
    try{

    
    let success = false;
    const id = req.id;

    console.log(id)

    //sort gives data in asscending or descending order and we can limit the number of documents using limit
    // let user2 = await User.find({name : "example"}).sort({email : -1}).limit(1)
    // console.log(user2)

    let user =await User.findById(id).select("-password")


    success = true
    res.json({success , user})
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error ")
}

} )


//Route 4 : update name of user : /api/auth/update
 

router.post('/update',fetchUser,detailsValidator,async(req,res)=>{
    try{

    
    let success = false;
    const id = req.id;
    const {name , password} = req.body;

    let user = await User.findByIdAndUpdate(id, {name , password})
    console.log(user)

    return res.json({success : "true", message :"Details updated"})
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error ")
}





})

module.exports = router
