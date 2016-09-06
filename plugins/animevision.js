var request    = require('request');
var cheerio    = require('cheerio');

function animevision(url) {
  this.url= url;
}

animevision.prototype.comparador = function (list1,list2){
  var flist = new Array;
  for (var i= 0; i < list1.length; i++){
      if (list1[i][1]) flist.push(list1[i]);
      else flist.push(list2[i]);
    }
return (flist);
};
animevision.prototype.getEpisodios = function ($,q='.fullhd_dados_area') {
    var flag = 0;
    var final = new Array;
    var animevision = this;
    $(q).filter(function(){
      var ar = new Array;
      var data = $(this);
      var link = data.children().eq(2);
      link.each(function(){
        var int = $(this).children('a');
        var aux =int.attr('href').trim().split("/");
        var dic = {nome : int.text() , link : int.attr('href').trim()};
        ar.push(aux[4])
        ar.push(dic);
      })
      if (ar.length < 2) flag = 1;
      final.push(ar);
    })
    if (flag == 1 && q == ".fullhd_dados_area"){
      var aux = animevision.getEpisodios($,".hd_dados_area");
      final = animevision.comparador(final, aux);
    }
    return(final);

};

animevision.prototype.gettitle = function ($) {
  var saida;
  $('.nome_item_media').filter(function(){
                var data = $(this);
                var title = data.text();
                title = title.trim();
                saida = title;
            })
  return (saida);
};
animevision.prototype.getinfo = function ($) {
  var saida;
  $('.area_skin_anime').filter(function(){
                var data = $(this);
                var info = data.children().eq(2).children().text();
                info = info.trim();
                saida = info;
            })
  return (saida);
};
animevision.prototype.getrelease = function ($) {
  var saida = "0000";
  return (saida);
};
animevision.prototype.getimage = function ($) {
  var saida;
  saida = $('.screen_capa_01').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
  saida = "https://animesvision.com" +saida
  return (saida);
};

animevision.prototype.start = function () {
json = { title : "", release : "", info : "", image : "", link : null};
var animevision = this;
request(this.url, function(error, response, html){
      if(!error){
            var $ = cheerio.load(html);
            json.title   = animevision.gettitle($);
            json.release = animevision.getrelease($);
            json.info    = animevision.getinfo($);
            json.image   = animevision.getimage($);
            json.link    = animevision.getEpisodios($);
                }
      else {
        console.log("erro ao entar no site");
        return(false)
      }
})
return(json);
};
module.exports = animevision;
