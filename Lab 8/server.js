var express = require('express');
var app = express();
var request = require('request');
var path = require('path');

// Server config
const PORT = 7777;
const HOSTNAME = "127.0.0.1";

// API credentials
const G_API_KEY = "AIzaSyCkfleD2A-9zHcVW8BS_wluHRP34jwJYys";
const CX_ID = "012017816240971408663:q2xl2tk9laa";
const CLARIFAI_KEY = "ff540abc3f394be89a378be44fb585b4";

// Setup Clarifai app
const Clarifai = require('clarifai');
const clarifaiApp = new Clarifai.App({
    apiKey: CLARIFAI_KEY
});

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/search', (req, res) =>{
    var text = req.query.text;
    
    //If text field is empty, state as such
    if (text == "" || text ==undefined){
        res.contentType('application/json');
        res.write(JSON.stringify("Invalid Text Argument"));
        res.end();
        return;
    }

    var imageSearchURL = "https://www.googleapis.com/customsearch/v1?" +
        "key=" + G_API_KEY + "&" +
        "q=" + text + "&" +
        "searchType=image&" +
        "cx=" + CX_ID;
    // Using google custom search endpoint, send a request out
    request(imageSearchURL, (error, response, body)=>{
        // Parse JSON and get link
        var result = JSON.parse(body);
        var link = result.items[0].link;

        var tags = "";

        // Use the link to retrive Clarifai Tags
        var content = clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, link).then(res=>{
            tags=res.outputs[0].data.concepts;
        }).then(_=>{
            // Combine link and tags into dict
            var apiResult = {}
            apiResult.link = link;
            apiResult.tags = tags;
            // Turn into JSON and send as response
            res.contentType('application/json');
            res.write(JSON.stringify(apiResult));
            res.end();
        })
    });
});

var server = app.listen(PORT, HOSTNAME, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});