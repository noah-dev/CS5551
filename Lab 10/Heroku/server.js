var express = require('express');
var app = express();
var request = require('request');
var path = require('path');

var MongoClient = require('mongodb').MongoClient;
var mongoDBURL = process.env.MONGODB_URI;
var COLLECTION = "history"

var FIXER_API_URL = "https://api.fixer.io/latest?base=USD"

// Server config
app.set('port', process.env.PORT || 5000);
app.set('host', process.env.HOST || '0.0.0.0');

app.use(express.static('static'))

// Home page - angularjs client
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, './home/index.html'));
});

app.get('/getAll', (req,res)=>{
    MongoClient.connect(mongoDBURL).then(db=>{
        var collection = db.collection(COLLECTION);
        collection.find().toArray((err,allRecords)=>{
            res.contentType('application/json');
            res.write(JSON.stringify(allRecords));
            res.end();
        });
    });
})

app.get('/add', (req, res)=>{
    var fromAmount = parseFloat(req.query.fromAmount);
    var toCurrency = req.query.toCurrency;
    request(FIXER_API_URL, (error, response, body)=>{
        var rates = JSON.parse(body).rates;
        var conversion = parseFloat(rates[toCurrency]);
        var toAmount = fromAmount * conversion;
        
        MongoClient.connect(mongoDBURL).then(db=>{
            var collection = db.collection(COLLECTION);
            var mostRecent = collection.find().sort({"index": -1}).limit(1).toArray((err,latest)=>{
                if (latest.length == 0){
                    index = 0;
                }
                else{
                    index = latest[0].index + 1;
                }

                newRecord = {}
                newRecord.index = index;
                newRecord.fromAmount = fromAmount;
                newRecord.toCurrency = toCurrency;
                newRecord.toAmount = toAmount;
                collection.insert(newRecord);
                res.contentType('application/json');
                res.write(JSON.stringify(newRecord));
                res.end();
            });
        });
    });
});

app.get('/update', (req, res) =>{
    var index = parseInt(req.query.index);
    var fromAmount = parseFloat(req.query.fromAmount);
    var toCurrency = req.query.toCurrency;
    request(FIXER_API_URL, (error, response, body)=>{
        var rates = JSON.parse(body).rates;
        var conversion = parseFloat(rates[toCurrency]);
        var toAmount = fromAmount * conversion;
        
        MongoClient.connect(mongoDBURL).then(db=>{
            var collection = db.collection(COLLECTION);
            search = {}
            search.index = index;

            newRecord = {}
            newRecord.index = index;
            newRecord.fromAmount = fromAmount;
            newRecord.toCurrency = toCurrency;
            newRecord.toAmount = toAmount;

            collection.updateOne(search, newRecord, (err, result) =>{
                res.contentType('application/json');
                res.write(JSON.stringify(result));
                res.end();
            });
        });
    });
});


app.get('/delete', (req, res) =>{
    var index = parseInt(req.query.index);
    MongoClient.connect(mongoDBURL).then(db=>{
        var collection = db.collection(COLLECTION);
        search = {}
        search.index = index;

        collection.deleteOne(search, (err, result) =>{
            db.close()
            res.contentType('application/json');
            res.write(JSON.stringify(result));
            res.end();
        });
    });

});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});