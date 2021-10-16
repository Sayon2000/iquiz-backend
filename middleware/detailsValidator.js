const { body, validationResult } = require('express-validator');

const detailsValidator = async(req, res , next)=>{
    try {
       await body('name','Name should be of minmum 5 characters long').isString().trim().isLength({ min: 5 }).run(req)
       await body('password','Passwords must be 5 characters long').isString().trim().isLength({ min: 5 }).run(req)

        

        const errors = validationResult(req);
        console.log(errors.array())

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        next()




    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error")
    }
}

module.exports = detailsValidator;