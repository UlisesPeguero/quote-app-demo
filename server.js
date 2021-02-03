const express = require('express');
const { MongoClient, ObjectID }= require('mongodb');
const app = express();
const PORT = 8080;
const DB_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'crud-em';

// db connection
MongoClient.connect(`${DB_URL}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(client => {
    console.log('Connected to database,');
    const db = client.db(DB_NAME);
    const Quotes = db.collection('quotes');

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static('public'));
    app.set('view engine', 'ejs');

    app.get("/", (request, response) => {
        Quotes.find().toArray()
            .then((results) => {
                console.log(results);
                response.render("index.ejs", {quotes: results});        
            })
            .catch(error => console.error(error));
        //response.sendFile(`${__dirname}/index.html`);
    });

    app.post("/quotes", (request, response) => {
        Quotes.insertOne(request.body)
            .then(result => {
                response.redirect('/');
            })
            .catch(error => console.error(error));
    });

    app.put('/quotes', (request, response) => {
        const id = request.body.id
        Quotes.findOneAndUpdate({
                _id: ObjectID(id)
            }, {
                $set: {
                    name: request.body.name,
                    quote: request.body.quote
                }
            }, {
                upsert: true 
        }).then(result => response.json({success: true}))
        .catch(error => console.error(error));
    });

    app.delete('/quotes/:id', (request, response) => {
        const id = request.params.id;
        Quotes.deleteOne({
            _id: ObjectID(id)
        }).then(result => response.json({deleted: result.deletedCount}))
        .catch(error => console.error(error));
    });

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

}).catch(error => console.error(error));    

