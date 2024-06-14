const express = require('express');
const app = express();
const createTeamRoute = require('./routes/registerRoute.js');
const cors = require('cors')

const corsOptions = {
        origin: "https://htmfront.onrender.com",
        methods: "POST",
        credentials:true,
}
app.use(cors(corsOptions));
const dotenv = require('dotenv');
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const mongoose = require('mongoose');

mongoose.connect(process.env.URL)
        .then(()=> console.log("db connected"))
        .catch((err)=> console.log(err))

app.use('/registerTeam', createTeamRoute);
app.listen(3000,() => console.log('server started'));   
