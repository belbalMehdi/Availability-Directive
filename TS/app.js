var app = angular.module("JReservation",[]);

app.directive("var",function($compile){
  var template = "<div></div>";
  HTMLElement.prototype.removeClass = function(c){
    var classes = this.className.split(" ");
    this.className = classes.splice(classes.indexOf(c),1);
    this.className = classes.join(" ");
  }
  HTMLElement.prototype.hasClass = function(c){
    return this.className.indexOf(c)>-1 ? true : false;
  }
  HTMLElement.prototype.addClass = function(c){
    this.className += " "+c;
  }
  var time = function(i){
    var h = (6 + Math.floor(i/2));
    var m = (i%2)? 30 : 0;
    var date = new Date(0);
    date.setHours(h);
    date.setMinutes(m);
    return date;
  }
  var generate = function(dates,options){
    var maxBlocks = (options.endTime - options.startTime + 1)*2;
    console.log(maxBlocks);
    //Container Tag
    var container = document.createElement("div");
    container.className = "dispo-container";
    //Style Tag (An inner styling make the directive independable of the rest of the project and reusable everywhere)
    var style = document.createElement("style");
    style.innerHTML = ".dispo-container{width:80vw;height:50px; border:1px outset rgba(214, 140, 140,0.8);display:flex;border-radius:40px; box-shadow:1px 4px rgba(214, 140, 140,0.6);}";
    style.innerHTML += ".dispo-block{width:"+(100/maxBlocks)+"%;height:100%; background-color: rgba(249, 19, 130,0.1); border-right:1px solid rgba(214, 140, 140,0.1);}";
    style.innerHTML += ".indispo-block{width:"+(100/maxBlocks)+"%;height:100%; background:linear-gradient( 0deg, rgba(201, 6, 6, 0.6) 0%, rgb(201, 6, 6) 50%, rgba(201, 6, 6,0.6));border-right:1px solid rgba(214, 140, 140,0.5);}";
    style.innerHTML += ".first-block{border-radius:40px 0px 0px 40px;}";
    style.innerHTML += ".last-block{border-radius:0px 40px 40px 0px;}";
    style.innerHTML += ".selected-block{background : linear-gradient( 0deg, rgba(52, 154, 63, 0.6) 0%, green 50%, rgba(52, 154, 63,0.6));}"

    container.appendChild(style);

    for(var i=0;i<maxBlocks;i++){
      var block = document.createElement("div");
      block.setAttribute("value", i);
      if(!dates[i])block.className = "dispo-block";
      else block.className = "indispo-block";
      if(i==0) block.className += " first-block";
      if(i==maxBlocks-1) block.className += " last-block";
      container.appendChild(block);
    }
    return container.outerHTML;
  }

  var link = function($scope,$element,$attrs){
    $element.html(generate($scope.dates,$scope.options));
    $compile($element.contents())($scope);
    var dispos = $element[0].querySelectorAll(".dispo-block");
    console.log(dispos);
    var temps = {debut:null, fin:null};
    for(var i=0;i<dispos.length;i++)
    {
      console.log(dispos[i]);
      dispos[i].addEventListener("mouseover",function(e){
        e.target.style.borderRight = "1px solid rgba(214, 140, 140,0.6)";
      })
      dispos[i].addEventListener("mouseleave",function(e){
        e.target.style.borderRight = "1px solid rgba(214, 140, 140,0)";
      })
      (function(i){
        dispos[i].addEventListener("click",function(e){
          var index = parseInt(e.target.getAttribute("value"));
          if(temps.debut==null){
            if(e.target.hasClass("selected-block")) e.target.removeClass("selected-block");
            else e.target.addClass("selected-block");
            $scope.choixDate.debut = time(index);
            temps.debut = index;
            $scope.$apply();
          }else{
            var j = parseInt(temps.debut)+1;
            var dispos = $element[0].querySelectorAll(".dispo-block");
            if(j<index){
              while(j<=index){
                console.log(j);
                if(dispos[j].hasClass("indispo-block")) break;
                if(dispos[j].hasClass("selected-block")) dispos[j].removeClass("selected-block");
                else dispos[j].addClass("selected-block");
                j++;
              }
            }
            else{
              while(j>index){
                if(dispos[j].hasClass("indispo-block")) break;
                if(dispos[j].hasClass("selected-block")) dispos[j].removeClass("selected-block");
                else dispos[j].addClass("selected-block");
                j--;
              }
            }

          }
        })
      })(i)
    }
    console.log($scope.choixDate);
  }

  return {
    restrict : 'EA',
    replace : true,
    trasclude : true,
    template : template,
    scope : {
      "dates" : "=dates",
      "choixDate" : "=choixDate",
      "options" : "=options"
    },
    link : link
  }
})

app.controller("myController",function($scope){
  $scope.dateDebut = [0,0,0,0,0,1,1,0,0,0,
                      1,0,1,0,1,0,0,0,0,1,
                      1,0,0,0,0,0,0,0,1];
  $scope.out = {debut:0};
  $scope.options = {
    startTime : 7,
    endTime : 18
  }
})
