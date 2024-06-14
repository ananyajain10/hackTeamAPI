const express = require('express');
const createTeamController = require('../controllers/register.js');
const router = express.Router()

router.post('/createTeam', createTeamController.createATeam);
router.post('/joinTeam', createTeamController.joinATeam);

module.exports = router;