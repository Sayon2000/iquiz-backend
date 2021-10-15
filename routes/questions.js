const express = require('express')
const fetchUser = require('../middleware/fetchUser')
const router = express.Router()

const Question = require('../model/Question');

const User = require('../model/User');
const questionValidator = require('../middleware/questionValidator');

//Route 1 : add a question , endpoint : /api/questions/add (POST)
router.post('/add',fetchUser ,questionValidator , async(req,res)=>{
    const id = await req.id
    let user = await User.findById(id)

    let success = false;


    const { question, options, answer ,tag, difficulty} = req.body;
    // console.log(question , options , answer , tag , difficulty);


    //checking if a similar question already exists
    let ques = await Question.findOne({question})
    if(ques){
        return res.status(400).json({success , message : "Duplicate question entry not allowed"})
    }



    //adding the question to database
    ques = await Question.create({question , options , answer , tag , difficulty , user : id , author : user.name});
    console.log(ques)



    success = true ;
    return res.json({success , message : "Question added succesfully"})
    
})

//Route 2 : update a question : /api/question/update/:id : POST

router.post('/update/:id',fetchUser ,questionValidator, async(req,res)=>{
    const id = await req.id;
    const questionId = await req.params.id;
    let success = false;
    const {question , options ,answer , tag , difficulty} = req.body;
    let ques = await Question.findById(questionId)
    console.log(ques)

    
    if(!ques){
        return res.status(400).json({success , message : "Question not present"})
    }

    // if()

    console.log(ques.user.toString())
    console.log(id)
    // console.log(ques.user ==)
    if(ques.user != id)
        return res.status(403).json({success , message : "unauthorized"})

    
    ques = await Question.findByIdAndUpdate(questionId,{question , options ,answer , tag , difficulty})

    success = true
    res.json({success , message : "Question succesfully updated"})
})



//Route 3 : delete a question : /api/question/delete/:id : POST

router.post('/delete/:id',fetchUser,  async(req,res)=>{
    const id = await req.id;
    const qid = req.params.id;

    let success = false;
    
    let ques = await Question.findById(qid)

    if(!ques)
        return res.status(400).json({success , message : "Question not found"})
        
        if(ques.user.toString() !== id){
            return res.status(403).json({success , message : "Unauthorized"})

    }

    ques = await Question.findByIdAndDelete(qid)
    success = true
    res.json({success , message : "Question deleted successfully"})
    
    
})



//Route 4 : get the questions posted by the user : /api/question/myquestions : POST

router.post('/myquestions', fetchUser , async(req,res)=>{
    try {
        

    const id = await req.id;
    let ques = await Question.find({user : id})
    res.json({success : "true", ques})

} catch (error) {
    console.log(error.message)
    res.status(500).send("Internal server error")
        
}

})




module.exports = router
