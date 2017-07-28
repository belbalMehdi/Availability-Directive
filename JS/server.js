var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static("static"));
var jsonParser = bodyParser.json();


  var pos = {};
  app.post('/position',jsonParser,function(req,res){
    pos = req.body;
    res.send(pos);
  })
  app.get('/position',function(req,res){
    res.send(pos);
  })

app.listen(8090);
