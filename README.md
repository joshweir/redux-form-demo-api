# Redux Form Demo API

A simple serverless express app api for use with https://github.com/joshweir/redux-form-demo 

This API is not production ready.

## Getting Started

Firstly, you need a mongodb instance running (ie. locally or mLab, MongoDB Atlas). Create `.env` file in the project root with the MongoDB connect string:

    MONGODB_URI=mongodb://[mongousername]:[mongopassword]@[dbhost:port]/[dbname]

Install serverless globally and install dependencies:

    yarn global add serverless
    yarn

### Local

Run serverless locally:

    sls offline start --skipCacheInvalidation --port 8000

Access at http://localhost:8000/forms/form-1

### Serverless

Deploy serverless:

    sls deploy

Access using sls returned endpoint.

## Routes

Cookies must be enabled, contains the following routes:

**POST /forms/**

Upsert a form associated to the current cookie session with `formName`, setting the `currentPage`, `totalPages` and the data associated to each page of the form. If a matching record is found associating the `formName` and current cookie session, update it, otherwise create a new record.

Request body example:

```
{
  //the current formName page
  currentPage: 2,
  //the total number of pages in the form
  totalPages: 4,
  //the current form
  formName: 'form-1',
  //the data associated to each page of the form
  data: [
    {
      "someField": "some field value",
      "anotherField": "another fields value"
    }
  ]
}
```

**GET /forms/{formName}**

Get the form with `formName` associated to the current cookie session. If a matching record is found associating the `formName` and current cookie session, return it, otherwise create a new record defaulting `currentPage` = 1, `totalPages` = 4, `data` = [] associated to the current cookie session and return it.

**DELETE /forms/{formName}**

Remove the form with `formName` associated to the current cookie session.