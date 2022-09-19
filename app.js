const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = "thisismysecretestring";

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]})

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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save()
    res.render("secrets")
})

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, user) => {
        if(!err) {
            if(user) {
                if(user.password === req.body.password) {
                    res.render("secrets")
                }
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