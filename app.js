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
        auth: "vathsal:843fe063e6e8a69fb061d5ddf31fc9d7-us13"

    }
    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, (response)=>{
        response.on("data", (d)=>{
            console.log(JSON.parse(d));
            if(d.total_created != 0){
                res.sendFile(__dirname + '/resources/html/success.html');
            }
            else{
                res.sendFile(__dirname + '/resources/html/failure.html');
            }

        });
    });
    request.write(jsonData);
    request.end();
});

app.listen(3000, ()=>{
    console.log("Server online on port 3000");
});