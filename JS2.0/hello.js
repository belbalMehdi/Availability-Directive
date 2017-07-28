function draw(reservations){
  var fromDateObject = function(reservations)
  {
    var ajusteDate = function(d){
      var date = new Date(d);
      var offset = date.getTimezoneOffset() * 60000;
      date = new Date(date.getTime()+offset);
      return date;
    }
    var heureDebut = [];
    var heureFin = [];
    for(i in reservations.reservations)
    {
      heureDebut[i] = ajusteDate(reservations.reservations[i].dateDebut).getHours();
      heureDebut[i]+=ajusteDate(reservations.reservations[i].dateDebut).getMinutes()/60;
      heureFin[i] = ajusteDate(reservations.reservations[i].dateFin).getHours();
      heureFin[i]+=ajusteDate(reservations.reservations[i].dateFin).getMinutes()/60;
      if(ajusteDate(reservations.reservations[i].dateDebut).getDay()<ajusteDate(reservations.reservations[i].dateFin).getDay()) heureFin[i] = 24;
      if(ajusteDate(reservations.reservations[i].dateDebut).getDay()>ajusteDate(reservations.reservations[i].dateFin).getDay()) heureFin[i] = 0;
    }
    var result = [];
    for(var i=0;i<24;i++){
      var test = false;
      heureDebut.forEach(function(e,j){
        if(calculeTimeInt(i)>=e&&calculeTimeInt(i)<=heureFin[j]) test = true;
      })
      if(test) result.push(true);
      else result.push(false);
    }
    function calculeTimeInt(value){
      var heure = Math.floor(value/2)+7;
      var minute = (value%2)*30;
      if(!minute) minute = 0;
      else minute = 0.5;
      return heure + minute;
    }
    return result;
  }

  var generateBar = function(){
  var bar = document.createElement("div");
  bar.className= "bar";
  var style = document.createElement("style");
  style.innerHTML = ".bar{width : 80vw;height : 40px;border : 1px solid #C0C0C0;display : flex;  border-radius : 40px;} .indicateur{font-size : 0.7em;font-weight: bold;position:relative;top:50px;right:15px;width : 70px;height : 20px;background-color : yellow;} .selected{background : linear-gradient( 0deg, rgba(52, 154, 63, 0.6) 0%, green 50%, rgba(52, 154, 63,0.6));}";
  var widget = document.createElement("div");
  widget.appendChild(style);
  widget.appendChild(bar)
  var tab = fromDateObject(reservations);
  var choix = {heureDebut : null, heureFin: null};

  for(var i=0;i<24;i++){
      var borderRadius = "";
      if(i==0) borderRadius = "border-radius : 40px 0px 0px 40px";
      if(i==23) borderRadius = "border-radius : 0px 40px 40px 0px";
      if(tab[i]==1)bar.innerHTML += "<div style='width:4.5454%; heigh:100%; background:linear-gradient( 0deg, rgba(201, 6, 6, 0.6) 0%, rgb(201, 6, 6) 50%, rgba(201, 6, 6,0.6));"+borderRadius+"' value='"+i+"'></div>";
      else bar.innerHTML += "<div style='width:4.5454%; heigh:100%; background-color:rgba(214, 140, 140,0.3);"+borderRadius+"' value='"+i+"' class='disponible-time'></div>";
  }

  function calculeTime(value){
    var heure = Math.floor(value/2)+7;
    var minute = (value%2)*30;
    if(!minute) minute = "00";
    return heure + ":" + minute;
  }

  var bars = bar.querySelectorAll("div");
  var disponibleTime = bar.querySelectorAll(".disponible-time");
  disponibleTime.forEach(function(elem){
    elem.addEventListener("mouseover",function(e){
      var time = calculeTime(e.target.getAttribute("value")) + " - "+calculeTime((parseInt(e.target.getAttribute("value"))+1));
      var indic = document.createElement("div");
      indic.className = "indicateur";
      indic.innerHTML = time;
      e.target.style.borderRight = "solid 2px red";
      e.target.style.borderLeft = "solid 2px red";
      e.target.appendChild(indic);
    })
    elem.addEventListener("mouseleave",function(e){
      e.target.removeChild(e.target.querySelector('div'));
      e.target.style.borderRight = "none";
      e.target.style.borderLeft = "none";
    })
    elem.addEventListener("click",function clickTime(e){
        var time = {};
        time.debut = calculeTime(e.target.getAttribute("value"));
        time.fin = calculeTime((parseInt(e.target.getAttribute("value"))+1));
        if(!e.target.hasClass("selected")){
          if(choix.debut==null){
            choix.debut = parseInt(e.target.getAttribute("value"));
            e.target.addClass('selected');
            e.target.setAttribute("selected-date",0);
          }
          else{
            choix.fin = parseInt(e.target.getAttribute("value"));
            var k = 0;
            for(var i=choix.debut;i<=choix.fin;i++)
             {
               if(bars[i].className.indexOf("disponible-time")<0){
                 choix.fin = i-1;
                 break;
               }
               k++;
               bars[i].setAttribute("selected-date",k);
               bars[i].addClass('selected');
             }
          }
        }
        else{
          bar.querySelectorAll(".selected").forEach(function(elem){
            choix = {};
            elem.removeClass('selected');
          })
        }
    })
  })



  Element.prototype.addClass = function(className){
    this.className += " "+className;
  }
  Element.prototype.hasClass = function(className){
    return this.className.indexOf(className)>=0;
  }
  Element.prototype.removeClass = function(className){
    var classes = this.className.split(" ");
    newClasses = classes.filter(function(e,i){if(e!=className) return e;});
    this.className = newClasses.join(" ");
  }
  var reserver = function(){
    if(choix.fin==null) choix.fin = choix.debut;
    var dateDebut = calculeTime(choix.debut);
    var dateFin = calculeTime(choix.fin+1);
    document.querySelector(".choix").innerHTML = "RESERVATION : de "+dateDebut + " à " + dateFin;
    document.querySelector("#heureDebut").value = dateDebut;
    document.querySelector("#heureFin").value = dateFin;
  }
  window.reserver = reserver;
  return widget;
}
  return generateBar();
};



var reservations = { reservations: [
{
idReservation: 393322,
dateDebut: "2015-03-19T07:30:00.000+0000",
dateFin: "2015-03-19T16:00:00.000+0000",
dateDepot: "2015-02-20T08:24:24.000+0000",
typeReserv: "V",
motif: "visite à domicile",
repetition: "aucune",
provenance: "CG",
titreExcept: null,
motifRefus: null,
nomFichier: null,
confidentiel: false,
demandeur: null,
_links: {
self: {
href: "http://localhost:8080/REST/reservations/393322"
},
reservation: {
href: "http://localhost:8080/REST/reservations/393322"
},
ressource: {
href: "http://localhost:8080/REST/reservations/393322/ressource"
},
numLiaison: {
href: "http://localhost:8080/REST/reservations/393322/numLiaison"
},
selection: {
href: "http://localhost:8080/REST/reservations/393322/selection"
}
}
},
{
idReservation: 356064,
dateDebut: "2014-06-25T07:30:00.000+0000",
dateFin: "2014-06-25T10:00:00.000+0000",
dateDepot: "2014-06-25T07:53:56.000+0000",
typeReserv: "V",
motif: "visites",
repetition: "aucune",
provenance: "CG",
titreExcept: null,
motifRefus: null,
nomFichier: null,
confidentiel: false,
demandeur: null,
_links: {
self: {
href: "http://localhost:8080/REST/reservations/356064"
},
reservation: {
href: "http://localhost:8080/REST/reservations/356064"
},
ressource: {
href: "http://localhost:8080/REST/reservations/356064/ressource"
},
numLiaison: {
href: "http://localhost:8080/REST/reservations/356064/numLiaison"
},
selection: {
href: "http://localhost:8080/REST/reservations/356064/selection"
}
}
},
{
idReservation: 356065,
dateDebut: "2014-07-01T08:00:00.000+0000",
dateFin: "2014-07-01T12:00:00.000+0000",
dateDepot: "2014-06-25T07:55:22.000+0000",
typeReserv: "V",
motif: "réunion ",
repetition: "aucune",
provenance: "CG",
titreExcept: null,
motifRefus: null,
nomFichier: null,
confidentiel: false,
demandeur: null,
_links: {
self: {
href: "http://localhost:8080/REST/reservations/356065"
},
reservation: {
href: "http://localhost:8080/REST/reservations/356065"
},
ressource: {
href: "http://localhost:8080/REST/reservations/356065/ressource"
},
numLiaison: {
href: "http://localhost:8080/REST/reservations/356065/numLiaison"
},
selection: {
href: "http://localhost:8080/REST/reservations/356065/selection"
}
}
},
{
idReservation: 356067,
dateDebut: "2014-06-27T09:00:00.000+0000",
dateFin: "2014-06-27T12:30:00.000+0000",
dateDepot: "2014-06-26T11:24:56.000+0000",
typeReserv: "V",
motif: "VD TETING SUR NIED + SAINT AVOLD",
repetition: "aucune",
provenance: "CG",
titreExcept: null,
motifRefus: null,
nomFichier: null,
confidentiel: false,
demandeur: null,
_links: {
self: {
href: "http://localhost:8080/REST/reservations/356067"
},
reservation: {
href: "http://localhost:8080/REST/reservations/356067"
},
ressource: {
href: "http://localhost:8080/REST/reservations/356067/ressource"
},
numLiaison: {
href: "http://localhost:8080/REST/reservations/356067/numLiaison"
},
selection: {
href: "http://localhost:8080/REST/reservations/356067/selection"
}
}
},
{
idReservation: 356068,
dateDebut: "2014-06-25T11:00:00.000+0000",
dateFin: "2014-06-25T15:00:00.000+0000",
dateDepot: "2014-06-25T07:58:38.000+0000",
typeReserv: "V",
motif: "pré admisdsion M.E. MAÏTI",
repetition: "aucune",
provenance: "CG",
titreExcept: null,
motifRefus: null,
nomFichier: null,
confidentiel: false,
demandeur: null,
_links: {
self: {
href: "http://localhost:8080/REST/reservations/356068"
},
reservation: {
href: "http://localhost:8080/REST/reservations/356068"
},
ressource: {
href: "http://localhost:8080/REST/reservations/356068/ressource"
},
numLiaison: {
href: "http://localhost:8080/REST/reservations/356068/numLiaison"
},
selection: {
href: "http://localhost:8080/REST/reservations/356068/selection"
}
}
}]};



document.querySelector(".bar").appendChild(draw(reservations));

// class App{
//   constructor(name){
//     this.name = name;
//     this.getName = function(){return this.name;}
//   }
// }
//
// class Controller extends Personnage{
//   constructor(name,arme){
//     super(name);
//     this.arme = arme;
//     this.getArme = function(){return this.arme;}
//   }
// }
//
// var s = new Controller("Rayleigh","Epée");
// console.log(s.getName(),s.getArme());

// var create = function(){
//   var content = "";
//   var colors = ['black','red','green','blue','orange','yellow','purple'];
//   var random = function(min,max){
//     return Math.round((Math.random()*(max-min))+min);
//   }
//   var affiche = function(val){
//     console.log(val);
//   }
//   for(let i =0;i<50;i++)
//   {
//     for(let j=0;j<50;j++)
//     {
//       val = random(0,100);
//       content += "<span class='notif notif-"+colors[random(0,6)]+" goWhite'>"+val+"</span> "
//     }
//   }
//   document.querySelector('#affi').innerHTML = content;
//   let notifs = document.querySelectorAll(".notif");
//   for(let i=0;i<notifs.length;i++){
//     notifs[i].addEventListener('click',function(e){
//       console.log(parseInt(e.target.innerHTML));
//     })
//   }
// }
// //create();
// //
// // var b = function(){return true;}
// // console.log(b.toString());
// // var reg = /\/\/@String\s*var(.+)\s*=\s*(.*);/g;
// // let script = `
// //   //@String
// //   var a = 5;
// //   console.log("a is a : "+typeof a);
// //
// //   //@String
// //   var myNumber = 55555;
// //   console.log("myNumber  is a : "+typeof myNumber);
// // `;
// //
// // var res = script.replace(reg,function(str,p1,p2){
// //   ri = str.slice(0,str.indexOf("=")+1);
// //   ri+="'"+p2+"';"
// //   ri = ri.slice(ri.indexOf('var'));
// //   return ri;
// // });
// // eval(script);
// // eval(res);
//
//
// // var Collection = function(collection=[]){
// //   this.collection = collection;
// // }
// //
// // Collection.prototype.findById = function(id){
// //   var re =[];
// //   if(this.collection.length>0){
// //     return this.collection.reduce((a,e,i)=>{
// //       if(e.id==id) re.push(this.collection[i]);
// //       return re;
// //     });
// //   }
// //   else{
// //     console.error("La collection est vide!");
// //   }
// // }
// //
// // var user = [
// //   {id:1,data:[1, 21, 3]},{id:2,data:[5, 8, 22]},{id:3,data:[37, 52, 63]},{id:4,data:[18, 26, 13]},{id:3,data:[165, 27, 83]}
// // ];
// //
// // var parser = new Collection(user);
// //
// // console.log(parser.findById(3));
//
//
// var open = function(){
//   return new Promise((resolve,reject)=>{
//     setTimeout(()=>{resolve(true)},2000);
//   })
// }
//
//
//
// var reservation = `class Reservation{
//   constructor(){
//     this.type ="Vehicule";
//   }
//   getType(){return this.type;}
// }`;
//
// String.prototype.insert = function(str,start){
//   s = this.indexOf(start)+start.length;
//   return this.slice(0,s)+'\n\t'+str+'\n'+this.slice(s+1);
// }
//
// var t = reservation.insert('this.name = "dido";','constructor(){');
// t = t.insert('this.name = "dido";','constructor(){');
// t = t.insert('console.log("hahahahaa");','constructor(){');
// t = t.insert('this.name = "dido";','constructor(){');
// t = t.insert('this.name = "dido";','constructor(){');
//
// var Reservation = new Function('return '+t)();
// let r = new Reservation();
//
// console.log(r.getType());
//
// var close = function(fct){
//   p=8; a=12; z=39;
//   var variables = {
//     'p':p,
//     'a':a,
//     'z':z
//   };
//   s = fct.toString();
//   injected = s.slice(s.indexOf('(')+1,s.indexOf(')')).split(',');;
//   injector=[];
//   injected.forEach(function(e,i){
//     injector.push(variables[e]);
//   });
//   fct.apply(this,injector);
// }
//
// close((a,p)=>{
//   console.log(p,a);
// })

// var collection = [
//   {id : 1, name: "didi"},
//   {id : 2, name: "walid"},
//   {id : 3, name: "youcef"},
//   {id : 4, name: "mehdi"},
// ];
//
// class Collection{
//   constructor(collection){
//     this.collection = collection;
//   }
//   add(obj){
//     this.collection.push(obj);
//   }
//   find(crit){
//     let objs = [];
//     this.collection.map(function(e,i){
//       let state = false;
//       for(let prop in crit){
//         if(crit[prop] == e[prop]) state = true;
//         else state = false;
//       }
//       if(state) objs.push(e);
//     })
//     console.log("found");
//     return objs;
//   }
//   findAll(){
//     return this.collection;
//   }
//   delete(id){
//     this.collection.map((e,i)=>{
//       if(e.id == id) this.collection.splice(i,1);
//     })
//   }
//   update(obj){
//     this.collection.map((e,i)=>{
//       if(e.id == obj.id) this.collection[i] = obj;
//     })
//   }
// }

// @Controller({name:"myController"})
// class Controller{
//   constructor(){
//
//   }
// }
//
//
//
// @Service({name:"myService"})
// @Component({name:"card", selector:"#card"})
// @Controller({name:"homeController"})
// @Mapping({url:"home",templateUrl:"views/home.html"})
// @Injected

// let db = new Collection(collection);
// res = db.add({id : 5, name : "Rayleigh"});
// console.log(db.find({name:"mehdi", id:4}));
// db.delete(3);
// perso = db.find({name:"mehdi", id:4})[0];
// perso.name = "niahahahaha";
// //db.update(perso);
// console.log(db.findAll());
//
// class Component{
//   constructor(elem,selector){
//     this.elem = elem;
//     this.selector = selector;
//   }
//   setHTML(elem){this.elem = elem;};
//   setSelector(selector){this.selector = selector;};
//   setData(data){this.data = data;};
//   compile(){
//     let elems = document.querySelectorAll(this.selector);
//     elems.forEach((e)=>{
//       e.innerHTML = this.elem;
//     })
//   }
// }
//
//
//
// $scope = {personne:[
//   {name:"mehdi", age:25},{name:"mehdi", age:25},{name:"mehdi", age:25}
// ],
// kaka : 22
// };
//
// $watch = function(obj,fct){
//   let before = JSON.stringify($scope[obj]);
//   var loop = function(obj,fct){
//     if(JSON.stringify($scope[obj])!=before) fct();
//     before = JSON.stringify($scope[obj]);
//     setTimeout(()=>{loop(obj,fct)},100);
//   }
//   loop(obj,fct);
// }
//
// $watch("kaka",function(){
//   console.log("kaka changed");
// });
// $scope.kaka = 88;
// let foreach = function(objs){
//   let result = ``;
//   objs.forEach(function(obj, i){
//     result += `<div style="width:500px;height:100px;margin-bottom : 20px; color : white; line-height: 100px;border-radius : 100px; background-color:rgba(8, 75, 138,0.9); text-align:center;">
//       ${obj.name} age ===> ${obj.age} index ====> ${i}
//     </div>`;
//   })
//   return result;
// }
//
// class MyComponent extends Component{
//     constructor(elem,selector){
//       super(elem,selector);
//       this.compile();
//     }
// }
// $watch("personne",function(){
//   var component = new MyComponent(foreach($scope.personne),"#affi");
//   component2.compile();
// });
// $scope.personne[2].name = "dido";


// var ob = {
//   perso : [{name:"alpha",age:44},{name:"beta",age:33},{name:"gama",age:25}],
//   data : {
//     obId : 1885458,
//     calc : function(){
//       return this.data;
//     }
//   }
// }
//
// class Observable{
//   constructor(obj,setter){
//     if(typeof obj != "object") obj = {};
//     return new Proxy(obj,{
//       set : function(obj,prop,value){
//         setter(obj,prop,value);
//       }
//     })
//   }
// }
// let setter = function(obj,prop,value){
//   console.log(prop);
//   obj[prop] = value;
// }
// let setter2 = function(obj,prop,value){
//   setter(obj,prop,value);
//   console.log("hello modification special");
// }
// var $scope = new Observable(ob,setter);
// $scope.name = new Observable(ob.name,setter2);
// $scope.name.hello = "hello";
// console.log($scope);


// var proxies = function(obj){
//   if(typeof obj === "object"){
//     let handler = {
//         set : function(obj,prop,value){
//           obj[prop] = value;
//           console.log(this);
//         },
//         get : function(obj,prop){
//           console.log(prop);
//           return obj[prop];
//         }
//     }
//
//     var prox  = function(obj,prop,proxyParent){
//       var key = Object.getOwnPropertyNames(obj);
//       proxyParent[prop] = new Proxy(obj,handler);
//       if(typeof obj === "object"){
//         for(i in key){
//           if(typeof obj[key[i]] === "object") prox(obj[key[i]],key[i],proxyParent[prop]);
//         }
//       }
//       return proxyParent;
//     }
//     return prox(obj,"ob",$scope={});
//   }
// }
// var $scope = proxies(ob);
// console.log("///////////////////////////////////////////////////////////////");
// console.log($scope.ob.data.calc);
