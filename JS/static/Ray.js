(function(){
  $ray = (function(){
    class RayDataBinder{
      constructor(){
        console.log("RayController");
      }
    }
    class RayHttpProvider{
      constructor(){
        console.log("RayController");
      }
    }
    class RayService{
      constructor(){
        console.log("RayController");
      }
    }
    class RayController{
      constructor(){
        console.log("RayController");
      }
    }
    class RayApp{
      constructor(appName){
        console.log("RayJS : "+appName);
        var r = new RayController();
      }
    }
    return{
        "RayApp" : RayApp
    }
  })();
  window.RayApp = $ray.RayApp;
  window.$import = function(url){
    let currentScript = document.currentScript;
    let newScript = document.createElement('script');
    newScript.async = false;
    newScript.id = script;
    var scripts = document.getElementsByTagName("script");
    for(let i in scripts){
     if(scripts[i].id==script) return false;
    }
    script = script.replace(/\./g, '/')+'.js';
    let xhr = new XMLHttpRequest();
    xhr.open('GET',script,false);
    xhr.send(null);
    newScript.innerHTML = xhr.response;
    document.body.insertBefore(newScript,currentScript);
    return true;
  }
  return $ray;
})()
