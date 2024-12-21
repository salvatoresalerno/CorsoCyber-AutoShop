
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


const transport = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASSWORD_MAIL
    }
  } as SMTPTransport.Options);

type SendEmailDto = {
    sender: Mail.Address;
    receipients: Mail.Address[];
    subject: string;
    message: string;
}

export const sendEmail = async (dto: SendEmailDto) => {
    const {sender, receipients, subject, message} = dto;
    
    return await transport.sendMail({
        from: sender,
        to: receipients,
        subject,
        html: message,
        text: message,
    })
}