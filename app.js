const express = require('express');
const app = express();
const createTeamRoute = require('./routes/registerRoute.js');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

mongoose.connect(process.env.URL)
        .then(()=> console.log("db connected"))
        .catch((err)=> console.log(err))

app.use('/registerTeam', createTeamRoute);
app.listen(3000,() => console.log('server started'));   
