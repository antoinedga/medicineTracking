const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream') // version 2.x

require('dotenv').config();
//require('./db/connectDB');

const app = express();

var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});

app.use(morgan('METHOD::method | PATH: ":url" | STATUS::status | res-time :response-time ms\n' +
    'DATE: :date[clf] UTC Format\n' +
    'IP: :remote-addr\n' +
    '________________________________________________________________________', { stream: accessLogStream }));



app.use(helmet());


// import routes
const routes = require('./routes')

app.use(express.json())
app.use(cors())

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(hpp());

app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname+'/view/build/index.html'));
    //res.sendFile(path.join(__dirname, 'client' ,'public', 'index.html'))
    res.send().status(200);
});

// middlewares

app.use('/api', routes)

const port = process.env.PORT || 8081;


app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
})
