const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
let db = require('./config/db');
const session = require('express-session');
var cors = require('cors');

const app = express();

const port = 8000;

var corsWhitelist = ['http://localhost:3000'];
var corsOptions = {
  origin: function(origin, callback) {
    if (corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'secret doesnt matter for demo',
    cookie: { maxAge: 60000 }
  })
);

MongoClient.connect(
  db.url,
  (err, database) => {
    if (err) return console.log(err);
    db = database.db('redux-form-demo');
    require('./app/routes')(app, db);
    app.listen(port, () => {
      console.log('Listening on ' + port);
    });
  }
);
