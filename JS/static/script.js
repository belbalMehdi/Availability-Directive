var dispoBar = function(dateTab){
  var elem = document.createElement('div');
  elem.className = "dispo";
  elem.style = "height : 15px; width : 15vw;display : flex;border : 1px solid #C0C0C0;margin-top: 15px;margin-left : 10px;font-size: 0.5em;color : gray;";
  var ajusteDate = function(d){
    var date = new Date(d)
    var offset = date.getTimezoneOffset() * 60000;
    date = new Date(date.getTime()+offset);
    return date;
  }

  var createDispo = function(dateTab){
    var heureDebut = [];
    var heureFin = [];
    for(i in dateTab)
    {
      heureDebut[i] = ajusteDate(dateTab[i].dateDebut).getHours();
      heureFin[i] = ajusteDate(dateTab[i].dateFin).getHours();
      console.log("d : "+ajusteDate(dateTab[i].dateDebut).getTime());
      console.log("f : "+ajusteDate(dateTab[i].dateFin).getTime());

      if(ajusteDate(dateTab[i].dateDebut).getDay()<ajusteDate(dateTab[i].dateFin).getDay()) heureFin[i] = 24;
      if(ajusteDate(dateTab[i].dateDebut).getDay()>ajusteDate(dateTab[i].dateFin).getDay()) heureFin[i] = 0;
    }
    let color = "white";
    let indicateur = "";
    for(let i=0;i<24;i++){
      var test = false;
      indicateur = "";
      for(j in heureDebut){
        if(i>=heureDebut[j]&&i<heureFin[j])test = true;
        if(i==heureDebut[j]) indicateur = "<span style='position:relative; top : -10px;left: -3px;'>"+heureDebut[j]+"</span>";
        else if(i==heureFin[j]) indicateur = "<span style='position:relative; top : -10px; left: -5px;'>"+heureFin[j]+"</span>";
      }
      if(i==0) indicateur = "<span style='position:relative; top : -10px; left: -3px;'>"+"00"+"</span>";
      else if(i==23) indicateur = "<span style='position:relative; top : -10px; float:right; left:5px;'>"+"00"+"</span>";
      if(test) color = "linear-gradient( 0deg, rgba(201, 6, 6, 0.6) 0%, rgb(201, 6, 6) 50%, rgba(201, 6, 6,0.6));";
      else color = "rgba(214, 140, 140,0.2)";
      elem.innerHTML += "<div style='width : 4.1666%;height:100%;background : "+color+";'>"+indicateur+"</div>";
    }
    return elem;
  }
  return createDispo(dateTab);
}

dateTab = [
  {dateDebut: "2011-05-26T06:00:00.000+0000",dateFin: "2011-05-26T09:00:00.000+0000"},
  {dateDebut: "2011-05-26T15:00:00.000+0000",dateFin: "2011-05-26T18:00:00.000+0000"},
  {dateDebut: "2011-05-26T19:00:00.000+0000",dateFin: "2011-05-26T22:00:00.000+0000"}
];
dateTab1 = [
  {dateDebut: "2011-05-26T08:00:00.000+0000",dateFin: "2011-05-26T15:00:00.000+0000"},
  {dateDebut: "2011-05-26T19:00:00.000+0000",dateFin: "2011-05-26T22:00:00.000+0000"}
];
dateTab2 = [
  {dateDebut: "2011-05-26T05:00:00.000+0000",dateFin: "2011-05-26T23:00:00.000+0000"},
];
dateTab3 = [
];
document.querySelector("#afficheur").appendChild(dispoBar(dateTab));
document.querySelector("#afficheur").appendChild(dispoBar(dateTab1));
document.querySelector("#afficheur").appendChild(dispoBar(dateTab2));
document.querySelector("#afficheur").appendChild(dispoBar(dateTab3));
