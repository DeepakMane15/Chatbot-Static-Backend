const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

// initialize nodemailer

const SendEmail = (req,res) => {

var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            user: 'manedeep2001@gmail.com',
            pass: 'nhzymhjbseaktxnz'
        }
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))


var mailOptions = {
    from: '"Deepak Mane" <manedeep2001@gmail.com>', // sender address
    to: req.body.maidId, // list of receivers
    subject: 'Welcome!',
    template: 'email', // the name of the template file i.e email.handlebars
    context:{
        name: "Deepak", // replace {{name}} with Adebola
        company: 'Cutomer Support ChatBot System' // replace {{company}} with My Company
    }
};

// trigger the sending of the E-mail
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    res.send({
        status:200,data:"Mail sent successfully!", source:"SendEmail"
    })
    console.log('Message sent: ' + info.response);
});
}

module.exports = {SendEmail}