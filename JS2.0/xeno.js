var XenoApp = (function(){
  var $scope = {name:"mehdi"};
  var controllers = {};
  var $dependencies = {
    $scope : $scope
  }
  var processInjector = function(ctrl){
    var args = [];
    var c = ctrl.toString();
    var params = c.slice(c.indexOf("(")+1, c.indexOf(")")).split(',');
    params.forEach(function(param){
      if($dependencies.hasOwnProperty(param))args.push($dependencies[param]);
      else console.error(param+" is not a valide dependency for "+ ctrl.name);
    })
    console.log(args);
  }
  var injectController = function(controller){
    controllers[controller.name] = controller;
    processInjector(controller);
    var ctrl = new controller();
  }
  return{
    controllers : controllers,
    injectController : injectController
  }
})();

class Component{
  constructor(selector,template,com=false){
    console.log(this.constructor.caller);
    this.selector=selector;
    this.template=template;
    if(com)this.compile();
  }
  setSelector(selector){this.selector=selector};
  setTemplate(template){this.template=template};
  getSelector(){return this.selector};
  getTemplate(){return this.template};
  compile(){document.querySelector(this.selector).innerHTML = this.template;}
}

//@RequestMapping({url:"/name",templateUrl:"views/home.html"})
class AccueilController{
  constructor($scope){
    var comp = new Component("my-app");
    comp.setTemplate(`<h2>hello ${$scope.name}</h2>`);
    comp.compile();
  }
}
XenoApp.injectController(AccueilController);
