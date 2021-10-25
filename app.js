require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true})

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

const secrets = process.env.SECRET
userSchema.plugin(encrypt, {secret: secrets, encryptedFields: ["password"]})

const User = new mongoose.model('User', userSchema)


app.get('/', function(req, res){
    res.render('home.ejs')
})

app.get('/login', function(req, res){
    res.render('login.ejs')
})

app.get('/register', function(req, res){
    res.render('register.ejs')
})


app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(err){
            console.log(err)
        } else {
            res.render('secrets.ejs')
        }
    })
})


app.post('/login', function(req, res){
    const userName = req.body.username
    const password = req.body.password

    User.find({email: userName, password: password}, (err, matchedItems) => {
        if(err){
            console.log(err)
        } else {
            if(matchedItems){
                res.render('secrets.ejs')
            }else{
                res.redirect('/')
            }
        }
    })
})




app.listen(3000, function(){
    console.log("Server started at port 3000")
})