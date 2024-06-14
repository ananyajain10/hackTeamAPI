const createTeamModel = require("../model/createTeamModel.js");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const createATeam = async (req, res) => {
    try {
        const { teamName, teamMembers } = req.body;

        const teamExists = await createTeamModel.findOne({ teamName });
        const emailExists = await createTeamModel.findOne({ "teamMembers.email": teamMembers[0].email });

        if (teamExists) {
            return res.status(400).json({ message: "Team already exists" });
        }

        if (emailExists) {
            return res.status(400).json({ message: "Email already exists in another team" });
        }

        const teamCodeGen = crypto.randomBytes(16).toString('hex') + teamName;

        const newTeam = new createTeamModel({
            teamName,
            teamMembers,
            teamCodeGen
        });

        await newTeam.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const emailContent = `
        Hi! HTM star,
        Share the code with friends to let them join the team:
        ${teamCodeGen}
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: teamMembers[0].email,
            subject: `Hi, you got registered`,
            text: emailContent,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error" });
            } else {
                console.log('Email sent:' + info.response);
                return res.status(201).json({ message: "Team created" });
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const joinATeam = async (req, res) => {
    try {
        const { teamCode, teamMembers: [member] } = req.body;

        const teamExists = await createTeamModel.findOne({ teamCodeGen: teamCode });
        const emailExists = await createTeamModel.findOne({ "teamMembers.email": member.email });

        if (!teamExists || emailExists) {
            return res.status(400).json({ message: "User exists or team does not exist" });
        }

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
        });

        const emailContent = `
        Hi! HTM star,
        You are in the team!!!
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: member.email,
            subject: `Hi, welcome to the team`,
            text: emailContent,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error" });
            } else {
                teamExists.teamMembers.push(newMember);
                await teamExists.save();
                console.log('Email sent:' + info.response);
                return res.status(201).json({ message: "Joined the team" });
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createATeam, joinATeam };
