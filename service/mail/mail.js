const nodemailer = require ('nodemailer')
const app = require ('express')()
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'sylvain.huss@gmail.com',
           pass: ''
       }
  });

function sendMail(body){
    const mailOptions = {
        from: 'sylvain.huss@gmail.com',
        to: body.to,
        subject: 'Résultat du test',
        html: '<p>' + body.prenom + ' ' + body.nom + ' a eu un score de ' + body.score + '</p>'
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

app.post('/mail', function(req, res) {
    console.log(req.body)
    sendMail(req.body)
    res.send("mail envoyé")
})

app.listen(3000,() => console.log("connecté!"))