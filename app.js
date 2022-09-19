require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 12


const app = express()


app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

app.use(express.static("public"))

mongoose.connect(process.env.MONGODB_URL)

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


// userSchema.plugin(encrypt, {secret: process.env.SECRETE, encryptedFields: ["password"]})

const User = mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})


app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, result) => {
        const newUser = new User({
            email: req.body.username,
            password: result
        })
        newUser.save(err => {
            if(!err) {
                res.render("secrets")
            } else {
                console.log(err)
            }
        })
    })
})

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, user) => {
        if(!err) {
            if(user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if(result === true) {
                        res.render("secrets")
                    } else {
                        res.redirect("/login")
                    }
                })
            } else {
                res.redirect("/register")
            }
        } else {
            console.log(err)
        }
    })
})


app.listen(3000, err => {
    if(!err) {
        console.log("sever successfully started.")
    } else {
        console.log(err)
    }
})