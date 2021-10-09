const jwt = require('jsonwebtoken')

const fetchUser =(req,res,next)=>{
    try {
        

    const token = req.headers['auth-token']
    if(!token)
        return res.status(400).send("Please use a valid token")
    const data = jwt.verify(token, process.env.JWT_SECRET)
    console.log(data)
    req.id = data.id;



    next()
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error ")
}
}

module.exports = fetchUser