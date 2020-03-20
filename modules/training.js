var express = require("express")

var trainingRouter = express.Router()

const db = require("../db")

const open_flame = require("../data/hazards_and_disasters/open_flame.json")

const getOpenFlame = () => open_flame

trainingRouter.get("/hazards/fire/open-flame", (req, res)=>{
    return res.status(200).send(getOpenFlame())
})

trainingRouter.get("/categories", (req, res)=>{
    const connection = db.get()
    var dbo = connection.db("hazadapt_trainer");
    dbo.collection("categories").find({}).toArray((err, result)=>{
        if(err) throw err;
        res.status(200).send(result)
    })
})

trainingRouter.post("/categories", (req, response)=>{
    const connection = db.get()
    var dbo = connection.db("hazadapt_trainer");
    dbo.createCollection(req.body.category, (err, createRes)=>{
        dbo.collection("categories").insertOne({name: req.body.category}, (err, insertRes)=>{
            dbo.collection("categories").find({}).toArray((err, result)=>{
                if(err) throw err;
                response.status(200).send(result)
            })
        })
    })
})

trainingRouter.post("/sub-categories", (req, response)=>{
    const connection = db.get()
    var dbo = connection.db("hazadapt_trainer");
    let {title, flowId, media, start, paragraph, objective, options, category} = req.body
    dbo.collection(category.name).insertOne({title, flowId, media, start, paragraph, objective, options}, (err, insertRes)=>{
        dbo.collection(category.name).find({}).toArray((err, result)=>{
            if(err) throw err;
            response.status(200).send(result)
        })
    })
})

trainingRouter.get("/course", async (req, response)=>{
    const connection = db.get()
    var dbo = connection.db("hazadapt_trainer");
    map = {trainingGraph: []}
    var categories = await dbo.collection("categories").find({}).toArray()
    var lesson_collection = categories.map(async category => {
        lessons = await dbo.collection(category.name).find({}).toArray()
        map.trainingGraph.push({title:category.name, storyElements:lessons})
        return lessons
    })
    Promise.all(lesson_collection).then(()=>{
        
        response.status(200).send(map)
    })
})

module.exports = trainingRouter



