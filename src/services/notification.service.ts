import * as dotenv from 'dotenv';
import {NotificationDataSource} from '../datasources/notification.datasource';
import {EmailNotification} from '../models/email-notification.model';
import {SmsNotification} from '../models/sms-notification.model';
const twilio = require('twilio');
const config = dotenv.config();

export class NotificationService {

  async SmsNotification(notification: SmsNotification): Promise<boolean> {
    try {
      const client = twilio(NotificationDataSource.accountSid, NotificationDataSource.authToken);

      await client.messages
        .create({
          body: notification.body,
          from: NotificationDataSource.fromSMS,
          to: notification.to
        })
        .then((message: any) => {
          console.log(message)
        });
      return true;
    } catch (error) {
      return false;
    }
  }

  async MailNotification(notification: EmailNotification): Promise<boolean> {

    try {
      console.log("variableH");
      console.log(NotificationDataSource)
      console.log(NotificationDataSource.sendgridApiKey)

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(NotificationDataSource.sendgridApiKey);
      const msg = {
        to: notification.to,
        from: NotificationDataSource.fromEmail,
        subject: notification.subject,
        text: notification.textBody,
        html: notification.htmlBody,
      };
      await sgMail.send(msg).then((data: any) => {
        console.log(data)
        return true;
      }, function (error: any) {
        console.log(error);
        return false;
      });
      return true
    }
    catch (error) {
      return false;
    }
  }
}
