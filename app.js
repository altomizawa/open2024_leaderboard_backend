const express = require('express');
const router = require("express").Router();
const connectDatabase = require('./data/database')
const bodyParser = require('body-parser');
const cors = require ('cors')

require('dotenv').config();

const app = express();

app.use(cors());

const athleteRouter = require('./routers/athletes')
const userRouter = require('./routers/users')
const {createUser, login} = require('./controllers/users')

const { PORT } = process.env;

connectDatabase();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('hello, world')
})
app.post('/register', createUser);
app.post('/login', login);

app.use('/athletes' , athleteRouter);
app.use('/users', userRouter);



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})