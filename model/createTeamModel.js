const mongoose = require('mongoose');

const createTeamSchema = new mongoose.Schema({
    teamName:{
        type: String,
        required: true,
        unique: true
    },
    teamMembers:[{
        teamMemberName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value){
                return /^\w+([\. -]?\w+)*@\w+([\. -]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: 'Invalid email format'

        },
    },
    university:{
        type: String,
        required: true
    }

}],
    teamCodeGen:{
        type: String,
        required: true
    }

})


module.exports = mongoose.model("createTeam", createTeamSchema)