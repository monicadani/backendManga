export const NotificationDataSource = {
  fromSMS: process.env.TWILIO_FROM,
  accountSid: process.env.TWILIO_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromEmail: process.env.SENDGRID_FROM,
  sendgridApiKey: process.env.SENDGRID_API_KEY
};


/*process.env.TWILIO_SID,*/
