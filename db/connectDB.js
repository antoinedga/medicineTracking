const mongoose = require('mongoose')

//connect to database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('Database Connected'))
.catch(err => console.log('Database Connection Error: ', err))
