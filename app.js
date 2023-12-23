const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
app.use(bodyParser.urlencoded({extended: true}));

// to load static files like css and images
app.use(express.static("resources"))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res)=>{
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
        auth: "vathsal:97111522e16a4d8404e49574039e1fa6-us13"

    }
    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, (response)=>{
        response.on("data", (d)=>{
            console.log(JSON.parse(d));
            if(d.error_count == 0)
                res.sendFile(__dirname + '/success.html');
            else
                res.sendFile(__dirname + '/failure.html');

        });
    });
    request.write(jsonData);
    request.end();
});

app.listen(3000, ()=>{
    console.log("Server online on port 3000");
});

// API Key
// 97111522e16a4d8404e49574039e1fa6-us13

// Audience ID
// 4359644686