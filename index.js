const express = require('express');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();

//MiddleWare & Body parser
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res)=>{
     res.send('Running my Velo Cycle Server')
});

app.listen(port, ()=>{
     console.log('Listening server port', port)
})