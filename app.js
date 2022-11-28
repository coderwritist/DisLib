const express = require('express');
const app = express();
const bp = require("body-parser");
app.use(bp.urlencoded({extended: true}));
app.listen(3000, function(){console.log("running...")});
const https = require("https");
const path = require("path");
const {MongoClient} = require('mongodb');// load mongodb
const { connect } = require('http2');
const { assert, profile, Console } = require('console');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { stringify } = require('querystring');
app.use(express.json())
app.set("view engine", "ejs")

const userschema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    pswd: {type: String, required: true},
    phno: {type: String, required: true},
    
})

const booksschema = mongoose.Schema({
    bookname: {type: String, required: true},
    edition: {type: String, required: true},
    author: {type: String, required: true},
    owner: {type: String, required: true},
    coursename: {type: String, required: true},

})

const usermodel = mongoose.model("users", userschema)
const bookmodel = mongoose.model("books", booksschema)



const port = 3000;


app.use(express.static(__dirname+ "/public"))


app.get("/", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./index.html"));

    }
)
app.get("/profile", function(req, res)
    {
        var query = req.query;
        // console.log(query.name)
        var profilename = query.name
        // console.log(profilename)
        usermodel.find(function(err, val){
            if(err)
            {
                console.log("ERRROR!!!!!!!!!")
                console.log(err)
            }
            else
            {
                for(let i = 0; i<val.length; i++)
                {
                    var temp = val[i]

                    if(temp.name === profilename)
                    {
                         res.render("profile", {"temp": temp})
                        return
                    }
    
                }
                
                res.sendFile(path.join(__dirname, "./404.html"));
                return
            }
        })
        
    }
)


app.get("/login", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./login.html"));
    }
)
app.get("/home", function(req, res)
    {
        bookmodel.find(function(err, books){
            if(err)
            {
                console.log("ERRROR!!!!!!!!!")
                console.log(err)
            }
            else
            {
                res.render("home", {"books": books});
            }
        })

    }
)

app.get("/register", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./register.html"));
    }
)

app.get("/search", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./search.html"));
    }
)

app.get("/enterbooks", function(req, res)
    {
        res.sendFile(path.join(__dirname, "./enterbooks.html"));
    }
)


app.post("/search", function(req, res){
    var bookname = req.body.bookname
    bookmodel.find(function(err, val){
        if(err)
        {
            console.log("ERRROR!!!!!!!!!")
            console.log(err)
        }
        else
        {
            for(let i = 0; i<val.length; i++)
            {
                var temp = val[i]
                if(temp.bookname === bookname)
                {
                    res.render("search", {"book": temp})
                    return
                }

            }
            
            res.sendFile(path.join(__dirname, "./404.html"));
            return
        }
    })

})


app.post("/login", function(req, res){
    // console.log("Iam here")
    var email = req.body.email
    var pswd  = req.body.pswd
    var flag = 0
    usermodel.find(function(err, val){
        if(err)
        {
            console.log("ERRROR!!!!!!!!!")
            console.log(err)
        }
        else
        {
            // console.log(val)
            for(let i = 0; i<val.length; i++)
            {
                var temp = val[i]
                if(temp.email === email && temp.pswd === pswd)
                {
                    flag = 1
                    res.redirect("/home")   
                    return
                }

            }
            
            res.sendFile(path.join(__dirname, "./404.html"));
            return
        }
    })

})


app.post("/register", function(req, res){

    var name = req.body.fname
    var email = req.body.email
    var pswd  = req.body.pswd
    var phno = req.body.phno
    var data = {
        name: name,
        email: email,
        pswd: pswd,
        phno: phno
    };
    db.collection("users").insertOne(
        data, (err, collection) => {
          if (err) {
            throw err;
          }
          console.log("Data inserted successfully!");
          res.redirect("/login")
          return
        });

})

app.post("/enterbooks", function(req, res){
    console.log(req.body)

    var bookname = req.body.bookname
    var edition = req.body.edition
    var author = req.body.author
    var owner = req.body.owner
    var coursename = req.body.coursename

    var data = {
        bookname:bookname,
        edition: edition,
        author: author,
        owner: owner,
        coursename: coursename
    };
    db.collection("books").insertOne(
        data, (err, collection) => {
          if (err) {
            throw err;
          }
          console.log("Data inserted successfully!");
          res.redirect("/home")   
          return
        });

})



app.post("/", function(req, res){
    console.log(req.body)
})




mongoose.connect("mongodb://localhost/dislib", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;