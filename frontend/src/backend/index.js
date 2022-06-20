import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';

var app = express();
var jsonParser = bodyParser.json()

app.use(cors({ origin: 'http://localhost:8080' }));

app.post('/', jsonParser, async function (req, res) {
    var url = "mongodb+srv://wilsonngja:wilsonngja@cluster0.20uxruv.mongodb.net/?retryWrites=true&w=majority";
    var database = {"Semester 1": 'venue_availability_sem1', 'Semester 2': 'venue_availability_sem2', 'Special Term 1': 'venue_availability_st1', 'Special Term 2' : 'venue_availability_st2'};
    var semester = req.body.semester;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database[semester]);
        var query = {};
        dbo.collection(req.body.req_week).find(query).toArray(function (err, result) {
            if (err) throw err;
            res.json({
                "result": result
            });
            db.close();
        });
    });

});

app.listen(3000);

