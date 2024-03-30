const router = require('express').Router();

const {
    getAllAthletes,
    createAthlete,
    changeAthleteScore,
    updateAthleteProfile,
    deleteAthlete,
} = require ('../controllers/athletes')

// GET ALL ATHLETES
router.get('/', getAllAthletes)

// CREATE ATHLETE
router.post('/', createAthlete)

// GET ALL ATHLETES
router.patch('/:id/scores', changeAthleteScore)

// UPDATE ATHLETE
router.patch('/:id', updateAthleteProfile)

// DELETE ATHLETE
router.delete('/:id', deleteAthlete)

module.exports = router;