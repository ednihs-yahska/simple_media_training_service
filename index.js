const express = require('express')
const app = express()
const port = 3000
const shortid = require('shortid')
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("productive_now");

    app.get('/todos', (req, res) => getAllTodos(req, res, dbo))

    app.post('/todos', (req, res) => postTodo(req, res, dbo))

    app.put('/todos/:id', (req, res) => putTodo(req, res, dbo))

    app.delete('/todos/:id', (req, res) => deleteTodo(req, res, dbo))

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    

});

function putTodo(req, res, dbo) {
    console.log("req ", req.body)
    dbo.collection('todos').updateOne({_id: req.params.id}, {$set: {title: req.body.title, isCompleted: req.body.isCompleted}}, (err, result)=>{
        if(err) throw err;
        console.log("U ", req.params.id)
        dbo.collection("todos").findOne({_id:req.params.id}, (error, findResult)=>{
            if(error) throw error;
            console.log(" Find ", findResult)
            res.status(200).send(findResult)
        })
    })
}

function postTodo(req, res, dbo) {
    console.log("req ", req.body)
    
    dbo.collection('todos').find({}).toArray((err, result)=>{
        if(err) throw err;
        const newId = result.length + 1
        const todo = {_id: newId+"", ...req.body}
        console.log("Todo ", todo)
        dbo.collection('todos').insertOne(todo, (err, result)=>{
            if(err) throw err;
            console.log("Inserted "+result.insertedId)
            dbo.collection("todos").findOne({_id:result.insertedId}, (error, findResult)=>{
                console.log(" Find ", findResult)
                res.status(201).send(findResult)
            })
        })
    })
    
}

function getAllTodos(req, res, dbo) {
    console.log("req ", req.body)
    dbo.collection('todos').find({}).toArray((err, result)=>{
        if(err) throw err;
        console.log(result)
        res.status(200).send(result)
    })
}

function deleteTodo(req, res, dbo) {
    dbo.collection("todos").deleteOne({_id:req.params.id}, (error, result)=>{
        if (error) throw error;
        console.log("count ", result.deletedCount);
        res.status(200).send()
    })
}





