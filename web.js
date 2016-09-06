var express          = require('express');
var bodyParser       = require("body-parser");
var app              = express();
var jade             = require('jade');
var animakai         = require('./plugins/animakai');
var animestelecine   = require('./plugins/animestelecine');
var animesvision     = require('./plugins/animevision');
var Protector        = require('./plugins/protectorlink')


app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/f', function(req, res){
var json;
if (req.body.options == 1){
var page = new animakai(req.body.site);
    json = page.start();
}
else if (req.body.options == 2) {
  var page = new animestelecine(req.body.site);
      json = page.start();
}
else if (req.body.options == 3) {
  var page = new animesvision(req.body.site);
      json = page.start();
}
var espera  = setInterval(function(){
  if (json.link != null){
  clearInterval(espera);
  if (req.body.options == 3){
    var pro = new Protector(json.link,'#download',1);
    pro.getprotectorlinks();
    var espera2 = setInterval(function() {
      json.link = pro.out;
      if (json.link != null){
        clearInterval(espera2);
        res.render('index',json);
      }

    },800);
  }
   else if (req.body.options == 1){
     var pro = new Protector(json.link,'#link',0);
     pro.getprotectorlinks();
     var espera2 = setInterval(function() {
       json.link = pro.out;
       if (json.link != null){
         clearInterval(espera2);
         res.render('index',json);
       }

     },800);
    }
  else {
    res.render('index',json);
  }

  }
}, 800);


})

app.get('/',function(req,res){
res.render('nindex');
})


app.listen('8081')

console.log('Magic happens on port 8081');
