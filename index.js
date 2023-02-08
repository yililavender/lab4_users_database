const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes.js');

const app = express();
app.use(express.json()); // Make sure it comes back as json

//TODO - Replace you Connection String here
mongoose.connect('mongodb+srv://yililavender:eAqZVy4SZiJU9rPy@cluster0.asthkb5.mongodb.net/comp3133_labs?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

app.use(userRouter);

app.listen(3000, () => { console.log('Server is running...') });