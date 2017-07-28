class Import{
	static script(script){
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
}

class Personne{
  constructor(name="",email="",age=""){

    this._Private_name = name;
    this._Private_email = email;
    this._Private_age = age;

    this.getName = ()=>{return this._Private_name};
    this.getEmail = ()=>{return this._Private_email};
    this.getAge = ()=>{return this._Private_age};
    this.setName = (name)=>{this._Private_name = name};
    this.setEmail = (email)=>{this._Private_email = email};
    this.setAge = (age)=>{this._Private_age = age};
    this.toString = ()=>{return '{"name":"'+this._Private_name+'", "email":"'+this._Private_email+'", "age":"'+this._Private_age+'"}'}
    this.toLine = ()=>{
      let tr =
      `<tr>
          <td>${this._Private_name}</td>
          <td>${this._Private_email}</td>
          <td>${this._Private_age}</td>
      </tr>`;
      return tr;
    }
  }
}

class Cookie{
	static setCookie(key,value,time=365){
		let exp = new Date();
		exp.setTime(exp.getTime()+time*24*60*60*1000);
		document.cookie = key+"="+value+"; expires="+exp.toUTCString()+";";
		return true;
	}

	static getCookie(key){
		let cookies = document.cookie.split(";");
		let result = undefined;
		for(let i in cookies){
			if(cookies[i].indexOf(key)==1||cookies[i].indexOf(key)==0){
				result = cookies[i].split("=")[1];
			}
		}
		return result;
	}

	static checkCookie(key){
		if(getCookie(key)!=undefined) return true;
		else return false;
	}

	static deleteCookie(key){
		if(checkCookie) setCookie(key,'',-1);
	}
}

class Component{
  constructor(selector="",content=""){
    this._Private_selector = selector;
    this._Private_content = content;
    this.getSelector = ()=>{return this._Private_selector};
    this.setSelector = (selector)=>{this._Private_selector = selector};
    this.getContent = ()=>{return this._Private_content};
    this.setContent = (content)=>{this._Private_content = content};
    this.compile = ()=>{
      document.querySelector(this._Private_selector).innerHTML = this._Private_content;
    }
  }
}

class Bind{
  constructor(target){
    return new Proxy(target,{
      get : (obj,attr)=>{
        return obj[attr];
      },
      set : (obj,attr,value)=>{
        let v = document.querySelectorAll("v["+attr+"]");
        for(let j =0;j<v.length;j++){
          v[j].innerHTML = value;
        }
        obj[attr] = value;
        return true;
      }
    });
  }
}

class DomReader{
  constructor(controller,obj){
    let elems = document.querySelector("[controller="+controller+"]").querySelectorAll("[v]");
    for(let i=0;i<elems.length;i++){
      let event = "change";
      if(elems[i].tagName == "INPUT") event = "keyup";
      elems[i].addEventListener(event,function(e){
        let key = this.getAttribute("v");
        obj[key] = this.value;
      })
    }
  }
}

class Link{
  constructor(obj,selector){
    this._Private_obj = obj;
    this._Private_selector = selector;
    this.getObj = ()=>{return this._Private_obj};
    this.getSelector = ()=>{return this._Private_obj};
    this.setObj = (obj)=>{this._Private_obj=obj};
    this.setSelector = (selector)=>{this._Private_obj=selector};
    this.bind = ()=>{
      return new Bind(this._Private_obj);
    }
  }
}

class Rest{
  static getJson(url,fct){
    return new Promise((resolve,reject)=>{
      let xhr = new XMLHttpRequest();
      xhr.open('GET',url);
      xhr.addEventListener('load',function(){
        if(xhr.status==200)resolve(JSON.parse(xhr.response));
        else reject(xhr);
      })
      xhr.send(null);
    })

  }
  static postJson(url,data,fct){
    let xhr = new XMLHttpRequest();
    xhr.open('POST',url);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.addEventListener('load',function(){
      fct(JSON.parse(xhr.response));
    })
    xhr.send(data);
  }
}

class App{
  constructor(){
    let personnes = new Array();
    for(let i=0;i<6;i++)
    {
      personnes[i] = new Personne("mehdi","belbalmehdi@gmail.com","25");
      personnes.push(personnes[i]);
    }

    let generate = ()=>{
      let result = "";
      for(let i in personnes) result+= personnes[i].toLine();
      return result;
    }

    let optionData = (data)=>{
      let template = "";
      for(let i in data){
        template += `<option>${data[i].name}</option>`;
      }
      return template;
    }

    let comp = new Component("#test",generate());
    comp.compile();
    let linker = new Link({},"#test");
    let binder = linker.bind();
    let dom = new DomReader("alpha",binder);
    Rest.getJson("data.json").then((response)=>{
      let options = new Component("#select",optionData(response.data));
      binder.b = response.data[0].name;
      options.compile();
    });
  }
}

var ok = function(){
	console.log("ok");
	var e = new CustomEvent("eventOK",{detail : {a:1,b:2}});
	document.dispatchEvent(e);
}

document.addEventListener("eventOK",function(e){
	console.log(e.detail.a);
})
