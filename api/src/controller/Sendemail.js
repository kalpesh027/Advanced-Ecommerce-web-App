import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'shivkumarloharkar2002@gmail.com',
    pass: 'jpmm sugq vqdz khpa'
  }
});

export const Sendmail = async (req, res) => {

  const { email, subject, message } = req.body

  try {
    const mailOptions = {
      from: 'shivkumarloharkar2002@gmail.com', // sender address
      to: email , // list of receivers
      subject: subject || 'Aapla bajar Feedback', // Subject line
      text: message, // plain text body
    };
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.response);

    res.json(info)

  }
  catch (e) {
    console.log(e)
  }
}


