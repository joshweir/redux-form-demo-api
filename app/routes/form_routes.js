module.exports = function(app, db) {
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
    db.collection('user_forms').findOne(query, (err, result) => {
      if (err) {
        res.status(500).send({ error: `An error has occurred ${err}` });
      } else {
        if (result) {
          db.collection('user_forms').update(query, formData, (err, result) => {
            if (err) {
              res.status(500).send({ error: `An error has occurred ${err}` });
            } else {
              res.send(formData);
            }
          });
        } else {
          db.collection('user_forms').insert(formData, (err, result) => {
            if (err) {
              res.status(500).send({ error: `An error has occurred ${err}` });
            } else {
              res.send(formData);
            }
          });
        }
      }
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
    db.collection('user_forms').findOne(query, (err, result) => {
      if (err) {
        res.status(500).send({ error: `An error has occurred ${err}` });
      } else {
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
          db.collection('user_forms').insert(formData, (err, result) => {
            if (err) {
              res.status(500).send({ error: `An error has occurred ${err}` });
            } else {
              res.send(formData);
            }
          });
        }
      }
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
    db.collection('user_forms').remove(query, (err, result) => {
      if (err) {
        res.status(500).send({ error: `An error has occurred ${err}` });
      } else {
        res.send('ok: ' + result);
      }
    });
  });
};
