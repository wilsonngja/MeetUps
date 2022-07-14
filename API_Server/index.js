import { MongoClient } from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

// const config = require('./config.json')

var app = express();
var jsonParser = bodyParser.json()

app.use(cors({ origin: {}}));

app.post('/', jsonParser, async function (req, res) {

    // var username = config['MONGODB_USERNAME'];
    // var password = config['MONGODB_PASSWORD'];

    var url = "mongodb+srv://" + process.env.username + ":" + process.env.password + "@cluster0.20uxruv.mongodb.net/?retryWrites=true&w=majority";
    var venue_database = {"Semester 1": 'venue_availability_sem1', 'Semester 2': 'venue_availability_sem2', 'Special Term 1': 'venue_availability_st1', 'Special Term 2' : 'venue_availability_st2'};
    var semester = req.body.semester;
    var venue = req.body.venue;

    if (req.body.type == 'venue')
    {
        try{
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(venue_database[semester]);
                var query = {"Availability Timeslot" : {$ne : [["0800","2200"]]}};
                dbo.collection(req.body.req_week).find(query).toArray(function (err, result) {
                    if (err) throw err;
                    res.json({
                        "result": result
                    });
                    db.close();
                });
            });
        }
        catch(err){
            console.log("ERROR");
        }
    }
    else if (req.body.type == 'free slot')
    {
        
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("timetables");
            var query = {'ModuleCode' : req.body.module_code, 'ClassType' : req.body.class_type, 'ClassNo' : req.body.class_code};
            dbo.collection(req.body.semester).find(query).toArray(function (err, result) {
                if (err) throw err;
                res.json({
                    "result": result
                });
                db.close();
            });
        });
    }

    else if (req.body.type == "venue timeslot")
    {
        try{
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(venue_database[semester]);
                var query = {'Venue': venue};
                dbo.collection(req.body.req_week).find(query).toArray(function (err, result) {
                    if (err) throw err;
                    res.json({
                        "result": result
                    });
                    db.close();
                });
            });
        } 
        catch(err){
            console.log("ERROR");
        }
    }  

});

app.listen(process.env.PORT || 3000);

