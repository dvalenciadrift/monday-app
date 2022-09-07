const AWS = require('aws-sdk');

const sendEmailNotification = async (message) => {
  
  const SesConfig = {
    region: 'us-east-1'
  };
  
  const params = {
    Source: 'hhamed@drift.com',
    Destination: {
      ToAddresses: [
        "psengineering@drift.com"
      ]
    },
    ReplyToAddresses: [
      'psengineering@drift.com'
    ],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `${message}`,
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Translation Error with Google API"
      }
    }
  };
  
  await new AWS.SES(SesConfig).sendEmail(params).promise().then((res)=> {
    console.log("Error email alert sent.")
  });
}

module.exports = {
  sendEmailNotification
}