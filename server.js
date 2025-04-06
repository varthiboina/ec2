const express = require('express');
const AWS = require('aws-sdk');

//Routes
const createRouter = require('./routes/ec2-create-route');

const app = express();
app.use(express.json());


AWS.config.update({ region: 'us-east-1' });


app.use('/ec2', createRouter);

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
