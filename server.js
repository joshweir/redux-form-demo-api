const express = require('serverless-express/express');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './.env' });
const session = require('express-session');
var cors = require('cors');
const connectToDatabase = require('./db');
const Form = require('./models/Form');

const app = express();

const port = 8000;

var corsWhitelist = ['http://localhost:3000', undefined];
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

const newUserForm = (formName, sessionId) => ({
  formName,
  sessionId,
  currentPage: 1,
  totalPages: 4,
  data: []
});

// expected req.body shape
/*
{
  currentPage: 2,
  formName: 'form-1',
  data: [
    {
      "someField": "some field value",
      "anotherField": "another fields value"
    }
  ]
}
*/
app.post('/forms', (req, res) => {
  const { currentPage, totalPages, formName, data } = req.body;
  if (!formName || !currentPage || !data || !totalPages) {
    res.status(400).send({ error: 'Missing required params!' });
    return;
  }
  const { id: sessionId } = req.session;
  if (!sessionId) {
    res
      .status(400)
      .send({ error: 'No session found, cookies must be enabled!' });
    return;
  }
  const query = { formName, sessionId };
  const formData = { currentPage, totalPages, formName, data, sessionId };
  connectToDatabase().then(() => {
    Form.findOne(query)
      .then(result => {
        Form.updateOne(query, formData)
          .then(() => res.send(formData))
          .catch(err =>
            res.status(500).send({ error: `An error has occurred ${err}` })
          );
      })
      .catch(err =>
        res.status(500).send({ error: `An error has occurred ${err}` })
      );
  });
});

app.get('/forms/:formName', (req, res) => {
  const { formName } = req.params;
  const { id: sessionId } = req.session;
  if (!sessionId) {
    res
      .status(400)
      .send({ error: 'No session found, cookies must be enabled!' });
    return;
  }
  const query = { formName, sessionId };
  connectToDatabase().then(() => {
    Form.findOne(query)
      .then(result => {
        /*
        expected response shape:
        {
          currentPage: 2,
          formName: 'form-1',
          sessionId: 'the session id',
          data: [
            {
              "someField": "some field value",
              "anotherField": "another fields value"
            }
          ]
        }
        */
        if (result) {
          res.send(result);
        } else {
          const formData = newUserForm(formName, sessionId);
          Form.create(formData)
            .then(() => res.send(formData))
            .catch(err =>
              res.status(500).send({ error: `An error has occurred ${err}` })
            );
        }
      })
      .catch(err =>
        res.status(500).send({ error: `An error has occurred ${err}` })
      );
  });
});

app.delete('/forms/:formName', (req, res) => {
  const { formName } = req.params;
  const { id: sessionId } = req.session;
  if (!sessionId) {
    res
      .status(400)
      .send({ error: 'No session found, cookies must be enabled!' });
    return;
  }
  const query = { formName, sessionId };
  connectToDatabase().then(() => {
    Form.remove(query)
      .then(result => res.send('ok ' + result))
      .catch(err =>
        res.status(500).send({ error: `An error has occurred ${err}` })
      );
  });
});

// app.listen(port, () => {
//   console.log('Listening on ' + port);
// });
module.exports = app;
