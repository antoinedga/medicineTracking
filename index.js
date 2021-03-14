const express = require('express');
const routes = require('./routes');
const middleware = require('./middleware');
const path = require('path')

require('./config');
require('./db/connectDB');

const app = express();

app.use(middleware);

app.use(express.static('/view/public/'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/view/public/index.html'));
  // res.sendFile(path.join(__dirname, 'client' ,'public', 'index.html'))
});

app.use('/api', routes());

const port = process.env.PORT || 8081;


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
