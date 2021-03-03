const express = require('express');
const routes = require('./routes');
const middleware = require('./middleware');

require('./config');
require('./db/connectDB');

const app = express();

app.use(middleware);

app.use(express.static('view/build'));


app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname+'/view/build/index.html'));
  // res.sendFile(path.join(__dirname, 'client' ,'public', 'index.html'))
  res.send().status(200);
});

app.use('/api', routes());

const port = process.env.PORT || 8081;


app.listen(port, () =>{
  console.log(`Listening on port ${port}`);
});
