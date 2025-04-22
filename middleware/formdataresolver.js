const resolvedata = async (req, res, next) => {
    const {
      instanceName,
      protocol,
      port,
      instanceType,
      regions,
      instances,
      inEachRegion,
      autoScaling,
      scalingLevel
    } = req.body;
  
    const awsRegionsMap = {
      "USA": "us-east-1",
      "UK": "eu-west-2",
      "Germany": "eu-central-1",
      "India": "ap-south-1",
      "Japan": "ap-northeast-1"
    };
  
    const awsInstanceTypeMap = {
      "Basic": "t2.micro",
      "High Traffic": "t3.medium",
      "Very High Traffic": "t3.large",
      "Computation Intensive": "c5.large"
    };
  
    const awsScalingLevelMap = {
      "Basic": "min=1,max=2",
      "Moderate": "min=2,max=4",
      "Advanced": "min=4,max=8"
    };
  
    req.body = {
      instanceName,
      protocol,
      port,
      instanceType: awsInstanceTypeMap[instanceType] || instanceType,
      regions: regions.map(region => awsRegionsMap[region] || region),
      instances,
      inEachRegion,
      autoScaling,
      scalingLevel: autoScaling ? awsScalingLevelMap[scalingLevel] || scalingLevel : null
    };

    console.log(req.body)
  
    next();
  };
  
  module.exports = resolvedata;
  