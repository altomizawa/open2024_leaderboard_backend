const router = require('express').Router();
const auth = require('../middleware/auth')


const {
    getAllAthletes,
    createRanking,
    getAthleteById,
    createAthlete,
    changeAthleteScore,
    updateAthleteProfile,
    deleteAthlete,
    getTeams,
} = require ('../controllers/athletes')

// GET ATHLETE BY ID
router.get('/:id', auth, getAthleteById)

// GET ALL ATHLETES
router.post('/filter', getAllAthletes)

// GET RX ATHLETES SORTED
router.post('/createranking', createRanking)

// CREATE ATHLETE
router.post('/', auth, createAthlete)

// CHANGE ATHLETE SCORES
router.patch('/:id', auth, changeAthleteScore)

// UPDATE ATHLETE
router.patch('/:id', auth, updateAthleteProfile)

// DELETE ATHLETE
router.delete('/:id', auth, deleteAthlete)

// GET TEAMS
router.post('/getteams', getTeams)

module.exports = router;