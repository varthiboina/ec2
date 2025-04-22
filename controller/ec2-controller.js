const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({ region: 'us-east-1' });

const ec2 = new AWS.EC2();

const createInstance = async (req, res) => {
  const { instanceType, instanceName } = req.body;

  const [amiId, region, keyName] = ['ami-0c8d9f17b7d43e7d9', 'us-east-1', 'NoSSHKeyPair'];

  if (!instanceType || !amiId || !region || !keyName || !instanceName) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const params = {
    ImageId: amiId,
    InstanceType: instanceType,
    MinCount: 1,
    MaxCount: 1,
    KeyName: keyName,
    Placement: { AvailabilityZone: `${region}a` },
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [
          {
            Key: 'Name',
            Value: instanceName,
          },
        ],
      },
    ],
  };

  try {
    // Run the instance and log the response to check for instanceId
    const data = await ec2.runInstances(params).promise();
    console.log('Instance launch response:', data); // Added logging

    if (!data || !data.Instances || data.Instances.length === 0) {
      return res.status(500).json({ error: 'Instance launch failed, no instance data received' });
    }

    const instanceId = data.Instances[0].InstanceId;
    let instanceInfo;
    let retry = 0;

    do {
      instanceInfo = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
      console.log('Instance Info:', instanceInfo); // Added logging for instance info

      await new Promise((resolve) => setTimeout(resolve, 200)); 
      retry++;
    } while (!instanceInfo.Reservations[0].Instances[0].PublicIpAddress && retry <= 5);

    if (!instanceInfo.Reservations[0].Instances[0].PublicIpAddress) {
      return res.status(500).json({ error: 'Instance did not receive a public IP within 5 retries' });
    }

    let publicIp = instanceInfo.Reservations[0].Instances[0].PublicIpAddress;

    res.status(200).json({
      message: 'EC2 instance launched successfully',
      instanceId: instanceId,
      publicIp: publicIp,
    });
  } catch (error) {
    console.error('Error launching EC2 instance:', error);
    res.status(500).json({ error: 'Failed to launch EC2 instance' });
  }
};

module.exports = createInstance;
