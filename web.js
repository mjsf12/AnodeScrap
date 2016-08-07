var express    = require('express');
var bodyParser = require("body-parser");
var request    = require('request');
var cheerio    = require('cheerio');
var app        = express();
var jade       = require('jade');

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.post('/f', function(req, res){
url = req.body.site;

request(url, function(error, response, html){


      if(!error){
          var $ = cheerio.load(html);
          var title, release, info;
          var flag = 0;
          var json = { title : "", release : "", info : "", image : "", link : null};
          function comparador(list1,list2){
            var flist = new Array;
            for (var i= 0; i < list1.length; i++){
                if (list1[i][1]) flist.push(list1[i]);
                else flist.push(list2[i]);
              }
          return (flist);
          }

          function getEpisodios(q='.l-fullhd') {
            var final = new Array;
            $(q).filter(function(){
              var ar = new Array;
              var data = $(this);
              var epi = data.children('a').attr('href');
              epi = epi.split('/');
              ar.push(epi.pop() + " : " + q)
              var link = data.children().children();
              link.each(function(){
                var int = $(this).children();
                var dic = {nome : int.text() , link : int.attr('href').trim()};
                ar.push(dic);
              })
              if (ar.length == 1) flag = 1;
              final.push(ar);
            })
            if (flag == 1 && q == ".l-fullhd"){
              var aux = getEpisodios(".l-hd");
              final = comparador(final, aux);
            }
            return(final);
          }

          $('#galeria-animes').filter(function(){
                        var data = $(this);
                        title = data.children().children().children().first().text();
                        title = title.trim();
                        json.title = title;
                    })
          $('.descricao').filter(function(){
                        var data = $(this);
                        info = data.text();
                        info = info.trim();
                        json.info = info;
                    })
          $('.info-geral').filter(function(){
                          var data = $(this);
                          release = data.children().eq(4).children().eq(1).text();
                          release = release.trim();
                          json.release = release;
                              })
          $('.img-responsive').filter(function(){
                          var data = $(this);
                          image = data.attr('src');
                          json.image = image;
                              })

        var aux = getEpisodios();
        json.link = aux;
        console.log(json.link);
        res.render('index',json);
      }
  })
})

app.get('/',function(req,res){
res.render('nindex');
})


app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
