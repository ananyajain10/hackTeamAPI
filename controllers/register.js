const createTeamModel = require("../model/createTeamModel.js");
const joinTeamModel = require('../model/joinTeamModel.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const createATeam = async(req, res)=>{
    try{
        const {teamName, teamMembers : [member]} = req.body;
        
        const teamExists = await createTeamModel.findOne({teamName:teamName});
        const emailExists = await createTeamModel.findOne({"teamMembers.email" : member.email});
        if(teamExists || emailExists){
            return res.status(400).json({message: "Team already exists"})
        } else{

        

        const teamCodeGen = crypto.randomBytes(16).toString('hex') + teamName;
        const newMember = {
            teamMemberName: member.teamMemberName, 
            email: member.email,
            university: member.university
          };

        const newTeam = new createTeamModel({
            teamName,
            teamMembers: [newMember],
            teamCodeGen

        })

        

        

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
        })

        const emailContent = `
        hii! HTM star
  
        
        Share the code with friends to let them join the team:
        ${teamCodeGen}
  
        
  
      `;


      let mailOptions = {
        from: process.env.EMAIL,
        to: member.email,
        subject: `Hii, you got registered`,
        text: emailContent,
      };

     transporter.sendMail(mailOptions, async (error, info)=>{
         if(error){
            console.log(error);
            return res.status(500).json({message: "Internal server error"})
         } else{
            await newTeam.save();
            console.log('Email sent:' + info.response);
            await res.status(201).json({message: "Team created"});
         }

     });
    }

    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"})
    }
}

const joinATeam = async(req, res)=>{
    try{
        const {teamCode, teamMembers: [member]} = req.body;

        const teamExists = await createTeamModel.findOne({teamCodeGen: teamCode});
        const emailExists = await createTeamModel.findOne({"teamMembers.email":member.email});

        if (!teamExists || emailExists){
            return res.status(400).json({message:"user exists or team does not exists"})
        }
        else{
            const newMember = {
                teamMemberName: member.teamMemberName, 
                email: member.email,
                university: member.university
            };
            
          
    
           
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD,
                },
            })
    
            const emailContent = `
            hii! HTM star
      
           You are in the team!!!
      
          `;
    
    
          let mailOptions = {
            from: process.env.EMAIL,
            to: member.email,
            subject: `Hii, welcome to the team`,
            text: emailContent,
          };
    
          transporter.sendMail(mailOptions, async (error, info)=>{
             if(error){
                console.log(error);
                return res.status(500).json({message: "Internal server error"})
             } else{

                teamExists.teamMembers.push(newMember);
                await teamExists.save();
                console.log('Email sent:' + info.response);
                await res.status(201).json({message: "Team created"});
             }
    
         });

           

        }


    } catch(err){
        console.log(err)
        return res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = {createATeam, joinATeam};
