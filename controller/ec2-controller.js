const AWS = require('aws-sdk'); // Import AWS SDK
require('dotenv').config();

AWS.config.update({ region: 'us-east-1' });



const ec2 = new AWS.EC2(); // Define ec2 instance

exports.createInstance = async(req , res) =>
    {
        const { instanceType, amiId, region, keyName } = req.body;

        if (!instanceType || !amiId || !region || !keyName) {
          return res.status(400).json({ error: 'Missing required parameters' });
        }
      
        const params = {
          ImageId: amiId, // The AMI ID to use for the instance
          InstanceType: instanceType, // The instance type (e.g., t2.micro)
          MinCount: 1, // Minimum number of instances to launch
          MaxCount: 1, // Maximum number of instances to launch
          KeyName: keyName, // Key pair name for SSH access
          Placement: { AvailabilityZone: `${region}a` }, // Correct, appending 'a'
        };
      
        try {
          const data = await ec2.runInstances(params).promise();
          const instanceId = data.Instances[0].InstanceId;
      
          res.status(200).json({
            message: 'EC2 instance launched successfully',
            instanceId: instanceId,
          });
        } catch (error) {
          console.error('Error launching EC2 instance:', error);
          res.status(500).json({ error: 'Failed to launch EC2 instance' });
        }
      }