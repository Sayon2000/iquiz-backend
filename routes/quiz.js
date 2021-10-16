const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const Question = require('../model/Question');
const User = require('../model/User');
const router = express.Router();


//Route 1 : Take a quiz : /api/quiz/take  : POST

router.post('/take',fetchUser, async(req,res)=>{


    try {
        

    const id = await req.id;
    let ques = await Question.find({user : {$ne : id}}).select("-user -answer")
    
    res.send(ques)

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error")
            
    }
    
})

//Route 2: evalute the points : /api/quiz/evalute : POST

router.post('/evalute',fetchUser,async(req,res)=>{
    let success = false
    const id = await req.id;
    let user = await User.findById(id)

    if(!user)
        return res.status(401).json({success, message : "User does not exists"})


    let {ans} = req.body;

    let pts = 0;
    const questionIdholder = [];
    
    for(let i = 0; i < ans.length; i++){
        elem = ans[i];

        //checking if a question is submitted twice 
        if(questionIdholder.includes(elem.id))
            continue;
        questionIdholder.push(elem.id)
  
        let ques = await Question.findById(elem.id)

        if(ques.answer === elem.answer)
            pts = pts + ques.points
    }


    user = await User.findByIdAndUpdate(id,{$push : {"prevpoints" : pts}, $inc : {"points" : pts}}, {new : true}).select("-password")





    res.json({pts,user})
})


//Route 3 : get all the points of the logged in user : /api/quiz/allpoints : POST
router.post('/allpoints',fetchUser,async(req,res)=>{
    const id = await req.id;
    const points = await User.findById(id).select("prevpoints points")
    res.send(points)
})

//Route 4 : get users list based on score :/api/quiz/ranking : no login required : POST
router.post('/ranking',async(req,res)=>{
    //get a array of user excluding the ones who have 0 points in total
    const usersRanking = await User.find({points : {$ne : 0}}).sort({points : -1}).select("name points date") 
    console.log(usersRanking)
    res.send(usersRanking)
})






module.exports = router;