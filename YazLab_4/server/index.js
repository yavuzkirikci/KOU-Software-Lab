const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();
const path = require("path");
const db = new sqlite3.Database(path.resolve("../local.db"));
const mongoose = require('mongoose');

// schemas
const taxiInfoSchema = new mongoose.Schema({
    date : String,
    hour : String,
    lat : String,
    lng : String,
    taxi_id : String
});

app.use(express.json());

app.post("/login", function (req, res) {
  let sql = `SELECT * FROM account_info WHERE (email = "${req.body.email}" AND 
        password = "${req.body.password}")`;

  let response = "";

  db.all(sql, [], (err, rows) => {
    if (!rows[0]) return res.status(404).json({ error: "no user match !!!" });

    db.run(
      "CREATE TABLE IF NOT EXISTS login_info(email text, time datetime)",
      (err) => {
            let ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
            console.log(ts)
            db.run(
            `INSERT INTO login_info(email, time) VALUES(?, ?)`, [req.body.email, ts],
            function (err) {
                if (err) {
                    console.log("ERROR" + err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);

                return res.status(200).json({ response: "user found", email_id : rows[0].email_id });
            }
            );
      }
    );
  });
});

app.post("/last_locations", async (req,res) => {

    let sql = `SELECT distinct id FROM connection_info WHERE (email = ${req.body.email_id})`;
    let taxi_ids = []
    db.all(sql, [], async (err, rows) => {
        
        rows.map(row => {
            taxi_ids.push(row["id"])
        })
        console.log(taxi_ids)
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.suejd.mongodb.net/app?retryWrites=true&w=majority');
        const TaxiInfo = mongoose.model('taxi_info', taxiInfoSchema);
        
        let taxi_infos = await TaxiInfo.find().where("taxi_id").in(taxi_ids)
        
      
        return res.status(200).json({"taxi_infos" : taxi_infos, "taxi_ids" : taxi_ids});
      
    })

})

app.post("/get_dates", (req, res) => {
  let sql = `SELECT distinct date FROM taxi_info WHERE (id = ${req.body.taxi_id})`;
  let dates = []
  db.all(sql, [], async (err, rows) => {
        
        rows.map(row => {
            dates.push(row["date"])
        })
        console.log(dates)
        return res.status(200).json({"dates" : dates});
      
    })
})

app.post("/get_locations_by_date", (req, res) => {
  
  let sql = `SELECT * FROM taxi_info WHERE (date = '${req.body.date}' AND id = ${req.body.taxi_id})`;
  let locations = []
  db.all(sql, [], async (err, rows) => {
        
        rows.map(row => {
            locations.push(row)
        })
        
        return res.status(200).json({"locations" : locations});
      
    })
})

app.post("/get_hours", (req, res) => {
  let sql = `SELECT hour FROM taxi_info WHERE (id = ${req.body.taxi_id}) AND date = '${req.body.date}'`;
  let hours = []
  db.all(sql, [], async (err, rows) => {
        
        rows.map(row => {
          hours.push(row["hour"])
        })
        
        return res.status(200).json({"hours" : hours});
      
    })
})

app.post("/get_location_by_date_and_hour", (req, res) => {
  
  let sql = `SELECT * FROM taxi_info WHERE (date = '${req.body.date}' AND id = ${req.body.taxi_id}
  AND hour = '${req.body.hour}');`
  
  db.all(sql, [], async (err, rows) => {
        if(rows[0].lng)
          return res.status(200).json({lng : rows[0]["lng"], lat : rows[0]["lat"]});
        return res.status(404)
    })
})

app.listen(3001);
