const express = require('express');
const router = require("express").Router();
const connectDatabase = require('./data/database')
const bodyParser = require('body-parser');
const cors = require ('cors')

require('dotenv').config();

const app = express();

app.use(cors());

const athleteRouter = require('./routers/athletes')

const { PORT } = process.env;

connectDatabase();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('hello, world')
})
app.use("/athletes", athleteRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})