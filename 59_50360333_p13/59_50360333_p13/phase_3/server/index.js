const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var session = require('express-session')
const db = require('./db')
const authRouter = require('./routes/auth-router')

const app = express()
const apiPort = 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.get('/', (req, res) => {
    res.send('Hello !!')
})


app.post('/topics/insert' , function (request, response) {

    let obj = {
        topic: request.body.topic,
        publisher: request.body.publisher
    };



   // insert only if object does not exist
   db.collection('Topics').updateOne(
           obj,
           { $setOnInsert: obj },
           { upsert: true }
   )


    /*
    db.collection('Topics').insertOne(obj, function (error, result) {
        if (error) throw error;
        console.log("Topic inserted");
    });
    */

});


app.post('/topics/remove' , function (request, response) {

    let query = {
        topic: request.body.topic,
        publisher: request.body.publisher
    };







    db.collection('Topics').remove(query, function (error , result) {
            if(error) throw error;
            console.log("Topic deleted");
    })

});



app.post('/subscriptions/insert' , function (request, response) {

    let obj = {
        subscriber: request.body.subscriber,
        publisher: request.body.publisher,
        topic: request.body.topic,
    };


    /*
    db.collection('Subscriptions').insertOne(obj, function (error, result) {
        if (error) throw error;
        console.log("Subscription inserted");
    });
    */

    // Insert only if subscription is not present
    db.collection('Subscriptions').updateOne(
       obj,
       { $setOnInsert: obj },
       { upsert: true }
    )

});


app.post('/subscriptions/remove' , function (request, response) {
    let query = { subscriber: request.body.subscriber, publisher: request.body.publisher, topic: request.body.topic };
    db.collection('Subscriptions').remove(query, function (error , result) {
        if(error) throw error;
        console.log("Subscription deleted");
    })
});



app.get('/subscriptions' , function (request, response) {
    let userName = request.query.subscriber;
    console.log("username is ",userName)
    db.collection('Subscriptions').find({"subscriber": request.query.subscriber}).toArray(function(error, result){
       if(error) throw error;
          return response.json(result);
    })
});


app.get('/topics' , function (request, response){

    db.collection('Topics').find({}).toArray(function(error, result){
       if(error) throw error;
          return response.json(result);
    })
});


app.post('/events/insert' , function (request, response) {
    let obj = { publisher: request.body.publisher, topic : request.body.topic , bookmaker: request.body.bookmaker, team1 : request.body.team1, team2 : request.body.team2, odds1 : request.body.odds1, odds2: request.body.odds2 };

    db.collection('Events').insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("Match inserted");
    })
});






app.use('/api/auth', authRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
