const express = require('express');
const AWS = require('aws-sdk');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

//middleware
const formdataresolver = require('./middleware/formdataresolver');
const ec2Launcher = require('./controller/ec2-controller');

// Routes
const createRouter = require('./routes/ec2-create-route');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // default layout

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('biopage', { title: 'Retrotale' });
});


app.get('/login',(req , res) =>
{
   res.render('loginpage' , {title : 'Login'});
});

app.get('/sign-up',(req , res) =>
  {
     res.render('signuppage' , {title : 'Sign Up'});
  });

app.get('/deploy-form', (req, res) => {
  res.render('serviceForm', { title: "Retrotale" });
});


app.post('/deploy-form',formdataresolver , ec2Launcher, (req, res) => {
  
  res.render('serviceForm', { title: "Retrotale" });
});

// Use the createRouter for the /ec2 route
//app.use('/ec2', createRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
