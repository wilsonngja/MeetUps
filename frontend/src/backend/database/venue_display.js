import { MongoClient as _MongoClient } from 'mongodb';

function test_fun(){
  

  var url = "mongodb+srv://wilsonngja:wilsonngja@cluster0.20uxruv.mongodb.net/?retryWrites=true&w=majority";
  
  console.log("HI");
  _MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("venue_availability_sem1");
      var query = {};
      dbo.collection("Week 1").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
  });
}

