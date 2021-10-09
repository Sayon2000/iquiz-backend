const connectToDb = require('./db')
const express = require('express')

const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = 5000

//middleware
app.use(express.json())
app.use(cors())


//connecting to mongoose database
connectToDb()


app.get('/', (req, res) => {
    res.send("Hello World")
})


//Available routes

app.use('/api/auth',require('./routes/auth'))
// app.use('/api/questions',require('./routes/questions'))




//Starting the server
app.listen(port, () => {
    console.log(`iNotebook backend app listening at http://localhost:${port}`)
  })