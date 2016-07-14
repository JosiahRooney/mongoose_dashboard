var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/goldfish');

var GoldfishSchema = new mongoose.Schema({
    name: String,
    age: Number,
    size: Number
});

mongoose.model('Goldfish', GoldfishSchema);
var Goldfish = mongoose.model('Goldfish');

app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


// GET '/' Displays all of the goldfish.
app.get('/', function(req, res) {
    console.log('HTTP/1.1 GET /');
    Goldfish.find({}, function (err, goldfish) {
        if (err) {
            console.log('GET / error', err);
        } else {
            res.render('index', {goldfish: goldfish});
        }
    });
});

// GET '/goldfish/new' Displays a form for making a new mongoose.
app.get('/goldfish/new', function(req, res) {
    console.log('HTTP/1.1 GET /goldfish/new');
    res.render('goldfish_new');
});

// GET '/goldfish/:id' Displays information about one mongoose.
app.get('/goldfish/show/:id', function(req, res) {
    console.log('HTTP/1.1 GET /goldfish/show/'+req.params.id);
    Goldfish.find({'_id':req.params.id}, function (err, goldfish) {
        if (err) {
            var host = req.get('host');
            console.log('GET /goldfish/show/'+req.params.id+' error', err);
            res.redirect(host);
        } else {
            res.render('goldfish', {goldfish: goldfish, goldfish_id: req.params.id});
        }
    });
});

// POST '/goldfish' Should be the action attribute for the form in the above route (GET '/goldfish/new').
app.post('/goldfish/new/process', function(req, res) {
    // Add goldfish to database
    var newFish         = new Goldfish();
        newFish.name    = req.body.name;
        newFish.age     = req.body.age;
        newFish.size    = req.body.size;
    newFish.save(function (err) {
        if (err) {
            console.log('Error saving goldfish in DB:',err);
        } else {
            console.log('New goldfish in DB. Name:',newFish.name,'Age:',newFish.age,'Size:',newFish.size);
            res.redirect('/');
        }
    });
});

// GET '/goldfish/:id/edit' Should show a form to edit an existing mongoose.
app.get('/goldfish/:id/edit', function(req, res) {
    Goldfish.findOne({'_id':req.params.id}, function (err, goldfish) {
        if (err) {
            var host = req.get('host');
            console.log('GET /goldfish/'+req.params.id+'/edit error', err);
            res.redirect(host);
        } else {
            res.render('goldfish_edit', {goldfish: goldfish});
        }
    });
});

// POST '/goldfish/:id' Should be the action attribute for the form in the above route (GET '/goldfish/:id/edit').
app.post('/goldfish/:id/edit/process', function(req, res) {
    // Update goldfish in database
    Goldfish.update({'_id': req.params.id}, {'name': req.body.name, 'age': req.body.age, 'size': req.body.size }, function (err) {
        if (err) {
            var host = req.get('host');
            console.log('POST /goldfish/'+req.params.id+'/edit error', err);
            res.redirect(host);
        } else {
            res.redirect('/');
        }
    });
});

// GET '/goldfish/:id/destroy' Should delete the mongoose from the database by ID.
app.get('/goldfish/:id/delete', function(req, res) {
    // Remove goldfish from database
    Goldfish.remove({'_id':req.params.id}, function (err) {
        if (err) {
            var host = req.get('host');
            console.log('POST /goldfish/'+req.params.id+'/delete error', err);
            res.redirect(host);
        } else {
            res.redirect('/');
        }
    });
});








app.listen(8000, function() {
    console.log("listening on port 8000");
});