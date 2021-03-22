const express = require('express');
const routes = require('./routes');
const middleware = require('./middleware');
const path = require('path');
const { loadAllConfigs } = require('./controllers/config/utils');

require('./config');
require('./db/connectDB');
loadAllConfigs();

const app = express();

app.use(middleware);

app.use(express.static('/view/public/'));


app.use('/api', routes());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/view/build/index.html'));
  // res.sendFile(path.join(__dirname, 'client' ,'public', 'index.html'))
});

const port = process.env.PORT || 8081;


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
