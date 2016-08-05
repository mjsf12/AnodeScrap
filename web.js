var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var jade = require('jade');

app.set('view engine', 'jade');
app.get('/', function(req, res){
url = 'http://www.animakai.tv/anime/re-zero-kara-hajimeru-isekai-seikatsu';

request(url, function(error, response, html){


      if(!error){

          var $ = cheerio.load(html);

          var title, release, info;
          var json = { title : "", release : "", info : "", image : ""};

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
          $('.thumb').filter(function(){
                          var data = $(this);
                          image = data.children().attr('src');
                          json.image = image;
                              })

        console.log(json);

        res.render('index',json)
      }
  })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
