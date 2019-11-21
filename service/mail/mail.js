const nodemailer = require ('nodemailer')
const app = require ('express')()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'sylvain.huss@gmail.com',
           pass: ''
       }
  });

function sendMail(to, nom, prenom){
    const mailOptions = {
        from: 'sylvain.huss@gmail.com',
        to: to,
        subject: 'test',
        html: '<p>Voici les résultats des tests de ' + prenom + nom + '</p>'
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err)
        else
            console.log(info);
    });
}

app.get('/test', function(req, res){
    console.log("test")
    res.send("test")
})

app.get('/mail', function(req, res) {
    res.send("mail envoyé")
    sendMail('sylvain.huss@gmail.com', 'hajji', 'wadii')
    res.send("mail envoyé")
})

app.listen(3000,() => console.log("connecté!"))