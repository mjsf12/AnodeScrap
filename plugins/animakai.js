var request    = require('request');
var cheerio    = require('cheerio');

function animakai(url) {
  this.url= url;
}

animakai.prototype.comparador = function (list1,list2){
  var flist = new Array;
  for (var i= 0; i < list1.length; i++){
      if (list1[i][1]) flist.push(list1[i]);
      else flist.push(list2[i]);
    }
return (flist);
};
animakai.prototype.getEpisodios = function ($,q='.l-fullhd') {
    var flag = 0;
    var final = new Array;
    var animakai = this;
    $(q).filter(function(){
      var ar = new Array;
      var data = $(this);
      var epi = data.children('a').attr('href');
      epi = epi.split('/');
      ar.push(epi.pop() + " : " + q)
      var link = data.children().children();
      link.each(function(){
        var int = $(this).children();
        var linkk = int.attr('href').trim();
        linkk = linkk.split("s=")[1];
        var dic = {nome : int.text() , link : linkk};
        ar.push(dic);
      })
      if (ar.length == 1) flag = 1;
      final.push(ar);
    })
    if (flag == 1 && q == ".l-fullhd"){
      var aux = animakai.getEpisodios($,".l-hd");
      final = animakai.comparador(final, aux);
    }
    return(final);

};

animakai.prototype.gettitle = function ($) {
  var saida;
  $('#galeria-animes').filter(function(){
                var data = $(this);
                var title = data.children().children().children().first().text();
                title = title.trim();
                saida = title;
            })
  return (saida);
};
animakai.prototype.getinfo = function ($) {
  var saida;
  $('.descricao').filter(function(){
                var data = $(this);
                var info = data.text();
                info = info.trim();
                saida = info;
            })
  return (saida);
};
animakai.prototype.getrelease = function ($) {
  var saida;
  $('.info-geral').filter(function(){
                  var data = $(this);
                  var release = data.children().eq(4).children().eq(1).text();
                  release = release.trim();
                  saida = release;
                      })
  return (saida);
};
animakai.prototype.getimage = function ($) {
  var saida;
  $('.img-responsive').filter(function(){
                  var data = $(this);
                  var image = data.attr('src');
                  saida = image;
                      })
  return (saida);
};

animakai.prototype.start = function () {
json = { title : "", release : "", info : "", image : "", link : null};
var animakai = this;
request(this.url, function(error, response, html){
      if(!error){
            var $ = cheerio.load(html);
            json.title = animakai.gettitle($);
            json.release = animakai.getrelease($);
            json.info = animakai.getinfo($);
            json.image = animakai.getimage($);
            json.link = animakai.getEpisodios($);
          }
      else {
        console.log("erro ao entar no site");
        return(false)
      }
})
return(json);
};
module.exports = animakai;
