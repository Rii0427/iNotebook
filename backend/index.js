require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

//The express.json middleware is important for parsing incoming JSON payloads and making that data available in the req. body or further processing within the routes.
app.use(express.json());

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

//GET Request made to the root URL
app.get('/',(req,res) => {
    res.send("Hello world");
});

//the app is listening for requests on a specific port and will log a message when it's ready
app.listen(port,(req,res) => {
    console.log(`iNotebook backend listening at http://localhost:${port}`);
});