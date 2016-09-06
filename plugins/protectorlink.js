var request    = require('request');
var cheerio    = require('cheerio');
function protector(link,fjq,i) {
  this.flag = i;
  this.link = link;
  this.out  = null;
  this.num  = 0;
  this.max  = 0;
  this.fjq  = fjq;
  var pro   = this;
  this.interval = setInterval(function () {
    if (pro.out != null){
      clearInterval(pro.interval);
    }
    else if (pro.max == pro.num && pro.max != 0){
      pro.out = pro.link;
    }
    console.log("num: " + pro.num+", Max: " +pro.max);
  },800)
}
protector.prototype.getprotectorlinks = function () {
  for (var i = 0; i < this.link.length;i++){
    console.log(this.link[i]);
    for (var j = 1; j < this.link[i].length;j++){
    this.getprotectorlink(this.link[i][j].link,i,j);
    this.max++;
    }
  }
}

protector.prototype.getprotectorlink = function (link,i,j) {
    var return1 = [];
    protector = this;
    if (this.flag == 1){
    link = "https://animesvision.com"+ link;
    }
    request(link, function(error, response, html){
        if(!error){
              var $ = cheerio.load(html);
              $(protector.fjq).each(function(){
                var data = $(this);
                var aux  = data.attr("href")
                return1.push(aux);
              })
              protector.link[i][j].link = return1[0];
            }
        else {
          //console.log("erro ao entar no Protector : \n"+error);
          return(false)
        }
        protector.num++;
  })
};
module.exports = protector;
