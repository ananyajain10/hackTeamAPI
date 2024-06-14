const express = require('express');
const app = express();
const createTeamRoute = require('./routes/registerRoute.js');
const cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const corsOptions = {
        origin: 'http://localhost:5173', 
        optionsSuccessStatus: 200, 
        methods: 'POST', 
        allowedHeaders: ['Content-Type']
      }
app.use(cors(corsOptions));
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

mongoose.connect(process.env.URL)
        .then(()=> console.log("db connected"))
        .catch((err)=> console.log(err))

app.use('/registerTeam', createTeamRoute);
app.listen(3000,() => console.log('server started'));   
