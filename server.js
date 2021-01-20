const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./db/connectDB')

const app = express()

// import routes
const routes = require('./routes')

app.use(express.static('view/build'))

app.use(express.json())
app.use(cors())

// middlewares
app.use('/api', routes) 

const port = process.env.PORT

app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
})
