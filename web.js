var express    = require('express');
var bodyParser = require("body-parser");
var app        = express();
var jade       = require('jade');
var animakai   = require('./plugins/animakai');

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/f', function(req, res){
var page = new animakai(req.body.site);
var json = page.start();

var espera  = setInterval(function(){
  if (json.link != null){
  res.render('index',json);
  clearInterval(espera);
  }
}, 800);


})

app.get('/',function(req,res){
res.render('nindex');
})


app.listen('8081')

console.log('Magic happens on port 8081');
