const { ModuleNode } = require('vite');
const Athlete = require('../models/athlete')

// GET ALL ATHLETES
module.exports.getAllAthletes = async (req, res) => {
  try{
    const {filter, sort} = req.body;
    const athletes = await Athlete.find(filter).sort(sort);
    if (!athletes) {
      return new Error()
    }
    res.status(200).json(athletes)
  } catch (err) {return res.status(400).send(err)};
}

module.exports.createRanking = async (req, res) => {
  try {
    const category = req.body

    const sortWodOne = {
      wodOneTime: 1,
      wodOneResult: -1,
    };

    const athletes = await Athlete.find(category).sort(sortWodOne)
    if (!athletes) {
      return new Error('Athletes could not be found')
    }

    // CREATE WOD ONE RANKING
    athletes.map(async (athlete, index) => {
      athlete.wodOneRanking = index + 1;
    })

    // CREATE WOD TWO RANKING
    athletes.sort( (a, b) => b.wodTwoResult - a.wodTwoResult)
    athletes.map(async (athlete, index) => {
      athlete.wodTwoRanking = index + 1;
    })

    // CREATE WOD THREE RANKING
    athletes.sort((a,b) => {
      if (a.wodThreeTime !== b.wodThreeTime) {
        return a.wodThreeTime - b.wodThreeTime
      }
      return b.wodThreeResult - a.wodThreeResult
    })
    // CREATE WOD THREE RANKING
    athletes.map(async (athlete, index) => {
      athlete.wodThreeRanking = index + 1;
      // CREATE TOTAL POINTS
      athlete.totalPoints = athlete.wodOneRanking + athlete.wodTwoRanking + athlete.wodThreeRanking;
    })

    // SORT BY TOTAL POINTS AND CREATE FINAL RANKING
    athletes.sort((a,b) => a.totalPoints - b.totalPoints)
    athletes.map(async(athlete, index) => {
      athlete.finalRanking = index + 1
      await athlete.save();
    })
    
    res.status(200).json(athletes)

  } catch (err) {return res.status(400).send(err)}
}

// CREATE ATHLETE
module.exports.createAthlete = async (req, res) => {
  try {
    const { name, avatar, email, password, category, isAdmin } = req.body;
    const athlete = await Athlete.findOne({email: email})
    if (athlete) {
      throw new Error("Athlete already in database")
    }
    const newAthlete = await Athlete.create({
      name,
      avatar, 
      email,
      password,
      category,
      isAdmin,
    })
    return res.status(200).json(newAthlete)

  } catch (err) {return res.status(400).send(err)};
}

// CHANGE ATHLETE SCORE
module.exports.changeAthleteScore = async (req, res) => {
  try {
    const { wodOneTime, wodOneResult, wodTwoResult, wodThreeTime, wodThreeResult } = req.body; // GET ALL UPDATE INFO FROM BODY
    const filter = req.params.id; // GET ATHLETE ID
    // FIND IF THERE'S AN ATHLETE WITH MATCHING ID
    const updatedAthlete = await Athlete.findById(filter);
    console.log(updatedAthlete)
    // IF ATHLETE IS NOT FOUND
    if (!updatedAthlete) {
      throw new Error('User not found')
    }

    // ATHLETE FOUND CHECK WHICH FIELDS NEED TO BE UPDATED AND UPDATE THEM
    if (wodOneTime !== undefined) {
      updatedAthlete.wodOneTime = wodOneTime;
    }
    if (wodOneResult !== undefined) {
      updatedAthlete.wodOneResult = wodOneResult;
    }
    if (wodTwoResult !== undefined) {
      updatedAthlete.wodTwoResult = wodTwoResult;
    }
    if (wodThreeTime !== undefined) {
      updatedAthlete.wodThreeTime = wodThreeTime;
    }
    if (wodThreeResult !== undefined) {
      updatedAthlete.wodThreeResult = wodThreeResult;
    }
    
    // SAVE RESULTS
    await updatedAthlete.save();
    
    // RETURN UPDATED ATHLETE
    return res.status(200).json(updatedAthlete)

  } catch (err) {return console.log(err)};
}

// UPDATE ATHLETE PROFILE
module.exports.updateAthleteProfile = async (req, res) => {
  const filter = req.params.id; // GET USER ID
  const { name, email, category } = req.body; // GET UPDATE INFO FROM BODY

  try{
    // CHECK IF THERE'S AN ATHLETE THAT MATCHES THE ID
    const thisAthlete = await Athlete.findById(filter);
    // ATHLETE NOT FOUND
    if (!thisAthlete) {
      throw new Error('Athlete not Found')
    };
    // ATHLETE FOUND, CHECK IF FIELDS ARE EMPTY AND IF THEY'RE NOT, UPDATE
    if (name !== undefined) {
      thisAthlete.name = name;
    }
    if (email !== undefined) {
      thisAthlete.email = email;
    }
    if (category !== undefined) {
      thisAthlete.category = category;
    }
    await thisAthlete.save(); // SAVE CHANGES

    // RETURN OBJECT
    return res.status(200).json(thisAthlete)
  } catch(err) {
      return console.log(err)
  }
}

// DELETE ATHLETE
module.exports.deleteAthlete = async (req, res) => {
  const filter = req.params.id; // GET USER ID
  try{
    // FIND AND DELETE USER
    const deletedAthlete = await Athlete.findByIdAndDelete(filter)

    // IF THERE'S NO MATCHING ID
    if (!deletedAthlete) {
      throw new Error('Athlete not found')
    }
    return res.status(200).json(deletedAthlete);
  } catch(err) {
    return console.log(err)
  }
}

// FIND ATHLETE BY ID
module.exports.getAthleteById = async (req, res) => {
  const filter = req.params.id; // GET USER ID
  try{
    // FIND ATHLETE
    const athlete = await Athlete.findById(filter);

    // IF THERE'S NO MATCH
    if (!athlete) {
      res.status(404).json({message: 'Athlete not found'})
    }
    return res.status(200).json(athlete)
  } catch (err) {
    console.error('Error fetching athlete', err.message)
    return res.status(500).json({ error: 'Internal server Error' })
  }
}

// module.exports.getAthleteById = async (req, res) => {
//   const id = 'Al Tomizawa'
//   try{
//     const athlete = await Athlete.find({_id: "6608c6b889b3f4d03dca58dd"})
//     if (!athlete) {
//       res.err(404).json({message: 'User not found'})}
//       res.sendStatus(200).json(athlete)
//   } catch (err) {message: 'internal server error'}
// }

// GET ALL TEAMS SORTED
module.exports.getTeams = async (req, res) => {
  // const { filter, sort } = req.body;
  const pipeline = [
    {
      "$match": {
        "team": { "$exists": true }
      }
    },
    {
      "$group": {
        "_id": "$team",
        "team_score": { "$sum": "$finalRanking" },
        "athletes": { "$push": "$$ROOT" }
      }
    },
    {
      "$sort": {
        "team_score": 1
      }
    }
  ];

  // FIND TEAMS
  try{
    const teams = await Athlete.aggregate(pipeline )
    res.status(200).json(teams)
  }
  catch (err) {console.log(err)}
}