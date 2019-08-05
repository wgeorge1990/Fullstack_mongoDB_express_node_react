const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb+srv://user_one_2019:Makemoves2019@cluster0-kvrje.mongodb.net/test?retryWrites=true&w=majority'

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method that fetches our data model
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
    Data.data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

// This get method fetches our users
router.get('/getUsers', (req, res) => {
    Data.users.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, users: data})
    })
})

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
    const { id, update } = req.body;
    Data.data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
    const { id } = req.body;
    Data.data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

// this is our create method
// this method adds new data in our database
router.post('/putData', (req, res) => {
    let data = new Data.data();

    const { id, message } = req.body;

    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }
    data.message = message;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});


// Add a user to the user collection inside of the database
router.post('/putUser', (req, res) => {
    let user = new Data.users();

    const {
        id,
        username, 
        firstname,
        lastname,
        image
    } = req.body;

    if ((!id && id !== 0) || !username) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }

    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;
    user.image = image
    user.id = id;
    debugger
    user.save((err) => {
        if (err) return res.json({
            success: false,
            error: err
        });
        return res.json({
            success: true
        });
    });
});


// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));