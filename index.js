const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express()

app.use(cors());
app.use(bodyParser.json());

const port = 5000




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mkcgo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db("redOnionStore").collection("foods");
    
    //insert foods
    app.post('/addFoods', (req, res) => {
        const food = req.body;

        foodCollection.insertMany(food)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    //read all food data
    app.get('/foods', (req, res) => {
        foodCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    //read single food data
    app.get('/singleFood/:id', (req, res) => {
        foodCollection.find({_id: ObjectId(req.params.id)})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })


});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);