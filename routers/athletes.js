const router = require('express').Router();

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

// GET ALL ATHLETES
router.post('/filter', getAllAthletes)

// GET RX ATHLETES SORTED
router.get('/createranking', createRanking)

// GET ATHLETE BY ID
router.get('/:id', getAthleteById)

// CREATE ATHLETE
router.post('/', createAthlete)

// GET ALL ATHLETES
router.patch('/:id/scores', changeAthleteScore)

// UPDATE ATHLETE
router.patch('/:id', updateAthleteProfile)

// DELETE ATHLETE
router.delete('/:id', deleteAthlete)

// GET TEAMS
router.post('/getteams', getTeams)

module.exports = router;