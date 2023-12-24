const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
app.use(bodyParser.urlencoded({extended: true}));

// to load static files like css and images
app.use(express.static("resources"))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/resources/html/signup.html');
});

app.post('/', (req, res)=>{
    console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const url = "https://us13.api.mailchimp.com/3.0/lists/4359644686/";
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const options = {
        method: "POST",
        auth: "vathsal:ef2eb5227e07aebef6af94e7f745e1da-us13"

    }
    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, (response)=>{
        response.on("data", (d)=>{
            console.log(JSON.parse(d));
        });
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/resources/html/success.html");
        }
        else{
            res.sendFile(__dirname + "/resources/html/failed.html");
        }
    });
    request.write(jsonData);
    request.end();
});

app.post('/failed', (req, res)=>{
    res.redirect('/');
});

app.listen(3000, ()=>{
    console.log("Server online on port 3000");
});