var express = require("express")

var trainingRouter = express.Router()

const open_flame = require("../data/hazards_and_disasters/open_flame.json")

const getOpenFlame = () => open_flame

trainingRouter.get("/hazards/fire/open-flame", (req, res)=>{
    return res.send(getOpenFlame())
})

module.exports = trainingRouter



