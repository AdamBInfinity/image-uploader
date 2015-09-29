var express = require('express');
var multer = require('multer');
var mongoose = require('mongoose');
var gm = require('gm').subClass({ imageMagick: true});

var app = express();
var port = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);

var uploadPhotoSchema = mongoose.Schema({
  fileName: String,
  path: String,
  uploaded: Date
});

var photoUploadLocation = '/photos/';

var UploadedPhoto = mongoose.model('photos', uploadPhotoSchema);

// var database = process.env.DATABASE_PORT_27017_TCP_ADDR || 'localhost';

// mongoose.connect('mongodb://' + database + '/photos');
mongoose.connect('mongodb://database/photos');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.engine('handlebars', require('hbs').__express);

app.use(multer({
  inMemory: true
}));


app.use(express.static(__dirname));

app.post('/api/upload', function(req, res) {
  console.log('attempting to save photo');

  gm(req.files.userFile.buffer)
    .resize(300)
    .autoOrient()
    .write(photoUploadLocation + req.files.userFile.name, function(err) {
      if (err) {
        console.log('something is really messed up; possible no imagemagick installed on server');
        return console.log(err);
      }

      var photo = new UploadedPhoto({
        fileName: req.files.userFile.originalname,
        path:  photoUploadLocation + req.files.userFile.name,
        uploaded: new Date()
      });

      photo.save(function(err, photo) {
        if (err) return console.error(err);
        console.log('photo successfully saved!');
        io.emit('new photo', {imagePath: photo.path});
      });

    });
});

app.get('/', function(req, res) {
  UploadedPhoto.find().sort('-uploaded').limit(1).exec(function(err, photos) {
    var photo = photos[0];
    if (err) console.error(err);
    if (photo) {
      res.render('home', {imagePath: photo.path});
    } else {
      res.render('home');
    }
  });
});

io.on('connection', function(socket) {
  console.log('a user connected');
});

var server = http.listen(port, function() {
  var host = server.address().address;
  console.log('App listening at http://%s:%s', host, port);
});
