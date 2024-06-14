const mongoose = require('mongoose');


const joinTeamSchema = mongoose.Schema({
    teamCode:{
        type: String,
        required: true
    },
    teamMembers:[{
        
    memberName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validation:{ 
            validator: function(value){
                return /^\w+([\. -]?\w+)*@\w+([\. -]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: 'Invalid email format'

        }
    },
    university:{
        type: String,
        required: true
    }
}]
})

module.exports = mongoose.model('joinTeam', joinTeamSchema);