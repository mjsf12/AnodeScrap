var express          = require('express');
var bodyParser       = require("body-parser");
var app              = express();
var jade             = require('jade');
var animakai         = require('./plugins/animakai');
var animestelecine   = require('./plugins/animestelecine');


app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/f', function(req, res){
console.log(req.body.options);
var json;
if (req.body.options == 1){
var page = new animakai(req.body.site);
json = page.start();
}
else if (req.body.options == 2) {
  var page = new animestelecine(req.body.site);
  json = page.start();
}

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
