import { sendEmail } from "@/lib/mail.utils";
import { NextRequest } from "next/server";






export async function POST(req: NextRequest) {

     const { text } = await req.json();


    const sender = {
        name: 'Auto Shop srl - Store OnLine',
        address: 'no-reply@auto-shop.com'
    }

    const receipients = [{
        name: 'Gestione Ordini',
        address: 'ordini@auto-shop.com'
    }]

    try {
        const result = await sendEmail({            
            sender,
            receipients ,
            subject: 'Nuovo Ordine',
            message: text
        })

        return Response.json({
            accepted: result.accepted
        })
    } catch (error) {
        console.error(error)
        return Response.json({ message: 'Impossibile inviare Mail'}, {status: 500})
    } 
}













/* export  async function POST(req: NextApiRequest, res: NextApiResponse) {
    
        const { to, subject, text } = req.body;
       
        const transporter = nodemailer.createTransport({
            host: process.env.HOST_MAIL,
            port: process.env.PORT_MAIL,
            auth: {
              user: process.env.USER_MAIL,
              pass: process.env.PASSWORD_MAIL
            }
          } as SMTPTransport.Options);

        // Configura l'email
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };  
       
        try {
            // Invia l'email
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email inviata con successo!' });
        } catch (error) {
            res.status(500).json({ error: 'Errore durante l’invio dell’email.' });
        }
    
}
 */