
import nodemailer from 'nodemailer'

export const sendEmail = async (options :{email:string,subject:string,message:string}) =>{
   const {EMAIL,EMAIL_PASSWORD} = process.env
 const transporter = nodemailer.createTransport({
    service : 'Gmail',    
    auth:{
        user : EMAIL,
        pass: EMAIL_PASSWORD ,
    }, 
 })


 const mailoptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message, 
 }

  await transporter.sendMail(mailoptions)
}

