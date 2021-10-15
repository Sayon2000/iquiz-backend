const { body, validationResult, check } = require('express-validator');

const questionValidator = async(req,res,next)=>{
    console.log("in question validator")

    await check('question', 'question must be of 5 characters and type should be String').isString().trim().isLength({ min: 5 }).run(req)


    await check('options',"There should be 4 options for each question").isArray().custom(value =>{
        if(value.length !== 4){
            return Promise.reject('Each question will have 4 options to choose from');
        }
        let success = true;
        value.map(elem => {
            if(typeof elem !== 'string')
                success = false
        })
        return (success) ? success : Promise.reject('Data type should be String');
    }).run(req)

    await body('answer','Should be of type String').exists().isString().run(req)


    const errors = validationResult(req);
    console.log(errors.array())

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    next()



}


module.exports = questionValidator;