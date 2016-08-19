var request    = require('request');
var cheerio    = require('cheerio');

function animestelecine(url) {
  this.url= url;
}

animestelecine.prototype.comparador = function (list1,list2){
  var flist = new Array;
  for (var i= 0; i < list1.length; i++){
      if (list1[i][1]) flist.push(list1[i]);
      else flist.push(list2[i]);
    }
return (flist);
};
animestelecine.prototype.getEpisodios = function ($,q='.links_1080p') {
    var flag = 0;
    var final = new Array;
    var animestelecine = this;
    $(q).filter(function(){
      var ar = new Array;
      var data = $(this);
      var epi = data.parent().parent().children().eq(0).text();
      epi = epi.trim();
      epi = epi.split("-");
      ar.push(epi[1] + " : " + q);
      var link = data.children().children();
      link.each(function(){
        var int = $(this);
        if (int.attr('data-urltratada') != undefined){
        var dic = {nome : int.text().trim() , link : int.attr('data-urltratada').split("<br")[0]};
        ar.push(dic);
      }
      })
      if (ar.length == 1) flag = 1;
      final.push(ar);
    })
    if (flag == 1 && q == ".links_1080p"){
      var aux = animestelecine.getEpisodios($,".links_720p");
      final = animestelecine.comparador(final, aux);
    }
    return(final);

};

animestelecine.prototype.gettitle = function ($) {
  var saida;
  $('.pag-anime-titulo').filter(function(){
                var data = $(this);
                var title = data.text();
                title = title.trim();
                saida = title;
            })
  return (saida);
};
animestelecine.prototype.getinfo = function ($) {
  var saida;
  $('.pag-anime-dados-direita').filter(function(){
                var data = $(this);
                var info = data.children().eq(1).children().eq(6).text();
                info = info.trim();
                saida = info;
            })
  return (saida);
};
animestelecine.prototype.getrelease = function ($) {
  var saida;
  $('.pag-anime-dados-direita').filter(function(){
                  var data = $(this);
                  var release = data.children().eq(1).children().eq(3).text();
                  release = release.trim();
                  saida = release;
                      })
  return (saida);
};
animestelecine.prototype.getimage = function ($) {
  var saida;
  $('.attachment-anime-serie-image').filter(function(){
                  var data = $(this);
                  var image = data.attr('src');
                  saida = image;
                      })
  return (saida);
};

animestelecine.prototype.start = function () {
json = { title : "", release : "", info : "", image : "", link : null};
var animestelecine = this;
request(this.url, function(error, response, html){
      if(!error){
            var $ = cheerio.load(html);
            json.title = animestelecine.gettitle($);
            json.release = animestelecine.getrelease($);
            json.info = animestelecine.getinfo($);
            json.image = animestelecine.getimage($);
            json.link = animestelecine.getEpisodios($);
            console.log(json.link);
          }
      else {
        console.log("erro ao entar no site");
        return(false)
      }
})
return(json);
};
module.exports = animestelecine;
