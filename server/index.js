const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();



const middlewares = require('./auth/middlewares');

const auth = require('./auth/index');
const api_Users = require('./api/users');
const api_Admin = require('./api/admin');


app.use(volleyball);
app.use(cors({
  origin: 'http://localhost:8080'
}));



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewares.checkTokenSetUser);

app.use('/auth', auth);
app.use('/api', middlewares.isLoggedIn , api_Users);
app.use('/admin', middlewares.isAdminLoggedIn, api_Admin);



app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨Hello World! 🌈✨🦄',
    user: req.user,
  });
});





function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});