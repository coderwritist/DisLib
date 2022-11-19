const express = require('express');
const app = express();
const bp = require("body-parser");
app.use(bp.urlencoded({extended: true}));
app.listen(3000, function(){console.log("running...")});
const https = require("https");
const path = require("path");
const {MongoClient} = require('mongodb');// load mongodb
const { connect } = require('http2');
const { assert } = require('console');

const port = 3000;


app.use(express.static(__dirname+ "/public"))


app.get("/", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./index.html"));
    }
)

app.get("/login", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./login.html"));
    }
)

app.get("/register", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./register.html"));
    }
)

app.get("/enterbooks", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./enterbooks.html"));
    }
)


app.post("/", function(req, res){
    console.log(req.body)
})

const url = "mongodb://localhost:3000";
const dbName = "LIBNET";
const client = new MongoClient(url);
client.connect(function(err){
    assert.equal(null, err);
    console.log("connected");
    const db = client.db(dbName);
    client.close();
})