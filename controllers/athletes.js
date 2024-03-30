const { ModuleNode } = require('vite');
const Athlete = require('../models/athlete')

module.exports.getAllAthletes = async (req, res) => {
  try{
    const athletes = await Athlete.find();
    if (!athletes) {
      return new Error()
    }
    res.status(200).json(athletes)
  } catch (err) {return res.status(400).send(err)};
}

module.exports.createAthlete = async (req, res) => {
  try {
    const { name, avatar, email, password, category, isAdmin } = req.body;
    const athlete = await Athlete.findOne({email: email})
    if (athlete) {
      console.log(athlete)
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

module.exports.changeAthleteScore = async (req, res) => {
  try {
    const { wodOneTime, wodOneResult, wodTwoResult, wodThreeTime, wodThreeResult } = req.body; // GET ALL UPDATE INFO FROM BODY
    const filter = req.params.id; // GET ATHLETE ID
    // FIND IF THERE'S AN ATHLETE WITH MATCHING ID
    const updatedAthlete = await Athlete.findById(filter);
    
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