var loader={
    files:{
        loaded:[],
        queue:[],
        active:false,
        get:function(script){
            if(script!=''&&loader.files.loaded.indexOf(script)==-1&&loader.files.queue.indexOf(script)==-1) {loader.files.queue.push(script);}
            if(loader.files.active==false&&loader.files.queue.length>0) {
                loader.files.active=true;
                loader.render();
                var element=document.createElement('script');
                element.type='text/javascript';
                element.async=true;
                element.src=loader.files.queue[0];
                element.onload=loader.files.set(script);
                element.onerror=loader.files.unset(script);
                var x=document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(element,x);
            }
        },
        set:function(script){
            if(loader.files.loaded.indexOf(script)==-1) {loader.files.loaded.push(script);}
            var queueindex=loader.files.queue.indexOf(script);
            if(queueindex!=-1) {loader.files.queue.splice(queueindex,1);}
            loader.files.active=false;
            loader.render();
            loader.files.get('');
        },
        unset:function(script){
            var index=loader.files.queue.indexOf(script);
            if(index>-1) {loader.files.queue.splice(index,1);}
            loader.files.active=false;
            loader.files.get('');
        },
        has:function(script){return (loader.files.loaded&&loader.files.loaded.indexOf(script)>-1);},
        resources:{}
    },
    memory:{
        values:[],
        expiration:365,
        load:function() {
            let decodedCookie=decodeURIComponent(document.cookie).split(';');
            if(decodedCookie) {
                var i=0;
                var newvalues=[];
                while(i<decodedCookie.length) {
                    var equalindex=decodedCookie[i].indexOf('=');
                    newvalues.push({
                        name:decodedCookie[i].substr(0,equalindex).replace(/\s/g,''),
                        value:decodedCookie[i].substr(equalindex+1).replace(/\s/g,'')
                    });
                    i++;
                }
                loader.memory.values=newvalues;
            } else {loader.memory.values=[];}
        },
        save:function() {
            const d=new Date();
            var expiration=365;
            if(loader.memory.expiration) {expiration=loader.memory.expiration;}
            d.setTime(d.getTime()+expiration*86400000);
            let expires="expires="+d.toUTCString();
            var i=0;
            while(i<loader.memory.values) {
                document.cookie=loader.memory.values[i].name+"="+loader.memory.values[i].value+";"+expires+";path=/";
                i++;
            }
        },
        set:function(name,value) {
            loader.memory.clear(name);
            loader.memory.values.push({name:name,value:value});
            const d=new Date();
            var expiration=365;
            if(loader.memory.expiration) {expiration=loader.memory.expiration;}
            d.setTime(d.getTime()+expiration*86400000);
            let expires="expires="+d.toUTCString();
            document.cookie=name+"="+value+";"+expires+";path=/";
            return;
        },
        clear:function(name) {
            document.cookie=name+'=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
            var i=loader.memory.values.length-1;
            while(i>=0) {
                if(loader.memory.values[i]&&loader.memory.values[i].name==name) {
                    loader.memory.values.splice(i,1);
                }
                i--;
            }
        },
        get:function(name) {
            var i=0;
            while(i<loader.memory.values.length) {
                if(loader.memory.values[i]&&loader.memory.values[i].name==name) {
                    return loader.memory.values[i].value;
                }
                i++;
            }
            return null;
        }
    },
    data:{
        token:'',
        active:0,
        value:null,
        get:async function(url) {
            const options={
                method:'GET',
                headers:{'Content-Type':'application/json'}
            };
            loader.data.active++;
            loader.render();
            return new Promise((resolve,reject)=>{
                fetch(url,options).then(function(response){return response.json();}).then(function(data){
                    loader.data.active--;
                    loader.render();
                    return resolve(data);
                }).catch(function(badresponse){
                    loader.data.active--;
                    loader.render();
                    return resolve(null);
                });
            });
        },
        put:async function(url,data) {
            if(loader.data.token!=null&&loader.data.token!=''&&data.token==null) data.token=loader.data.token;
            const options={
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(data)
            };
            loader.data.active++;
            loader.render();
            return new Promise((resolve,reject)=>{
                fetch(url,options).then(function(response){return response.json();}).then(function(data){
                    loader.data.active--;
                    loader.render();
                    return resolve(true);
                }).catch(function(badresponse){
                    loader.data.active--;
                    loader.render();
                    return resolve(false);
                });
            });
        },
        post:async function(url,data) {
            if(loader.data.token!=null&&loader.data.token!=''&&data.token==null) data.token=loader.data.token;
            const options={
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(data)
            };
            loader.data.active++;
            loader.render();
            return new Promise((resolve,reject)=>{
                fetch(url,options).then(function(response){return response.json();}).then(function(data){
                    loader.data.active--;
                    loader.render();
                    return resolve(data);
                }).catch(function(badresponse){
                    loader.data.active--;
                    loader.render();
                    return resolve(null);
                });
            });
        },
        delete:function(url) {
            const options={
                method:'DELETE',
                headers:{'Content-Type':'application/json'}
            };
            loader.data.active++;
            loader.render();
            return new Promise((resolve,reject)=>{
                fetch(url,options).then(function(response){return response.json();}).then(function(data){
                    loader.data.active--;
                    loader.render();
                    return resolve(true);
                }).catch(function(badresponse){
                    loader.data.active--;
                    loader.render();
                    return resolve(false);
                });
            });
        }
    },
    render:function() {
        var loaderelement=document.getElementById('loader');
        if(loader.data.active<0) loader.data.active=0;
        if(loader.files.queue.length>0||loader.data.active>0) {
            if(loaderelement) loaderelement.innerHTML='<span class="bli4">&#73869;</span><span class="bli5">&#73994;</span><span class="bli6">&#73850;</span>';
        } else {
            if(loaderelement) loaderelement.innerHTML='';
        }
    },
    html:{
        innervalue:function(text){
            if(text==null||text=='')return '';
            return text.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        },
    }
};
var safehtml={
    innervalue:function(text){
        if(text==null||text=='')return '';
        return text.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
}
var sidebar={
    active:false,
    toggling:false,
    select:function(option){
        pagebody.set(option);
        this.close();
    },
    toggle:function(){
        if(this.toggling)return;
        this.active=!this.active;
        var sidebarelement=document.getElementById('sidebar');
        var sidebargrey=document.getElementById('sidebargrey');
        var sidebarmenu=document.getElementById('sidebarmenu');
        var sidebaropen=document.getElementById('sidebaropen');
        var activeclass=this.active?'active':'';
        if(sidebarelement)sidebarelement.classList=activeclass;
        if(sidebargrey)sidebargrey.classList=activeclass;
        if(sidebarmenu)sidebarmenu.classList=activeclass;
        if(sidebaropen)sidebaropen.classList=activeclass;
        this.toggling=true;
        setTimeout(function(){sidebar.toggling=false},200);
    },
    close:function(){
        if(this.toggling)return;
        this.active=true;
        this.toggle();
    }
};
var pagebody={
    current:'',
    active:false,
    loading:'',
    set:function(page,data){
        if(page==null||page=='')page=this.loading;
        if(page==null||page=='')page=this.current;
        if(page==null||page=='')return;
        if(this.active&&page!=this.current)this.loading=page;
        if(this.resources[page]==null){
            loader.files.get('/page/'+page);
            this.loading=page;
            return;
        }
        if(page==this.current)return;
        var innerhtml=this.resources[page].html();
        var title=this.resources[page].title();
        var titlehtml='<div></div>'+((title!=null&&title!='')?('<h1>'+title+'</h1>'):'');
        var animatedtitle=document.getElementById('animatedtitle');
        if(animatedtitle){
            animatedtitle.innerHTML=titlehtml;
            animatedtitle.classList='active';
        }
        if(this.current!=''&&this.current!=null&&this.resources[this.current].close!=null)this.resources[this.current].close();
        if(this.resources[page].open)this.resources[page].open(data);
        this.current=page;
        this.active=true;
        setTimeout(function(){
            var pagebodyelement=document.getElementById('mainpage');
            if(pagebodyelement!=null&&innerhtml!=null)pagebodyelement.innerHTML=innerhtml;
            this.current=page;
            setTimeout(function(){
                this.active=false;
                var animatedtitle=document.getElementById('animatedtitle');
                if(animatedtitle){
                    animatedtitle.innerHTML='';
                    animatedtitle.classList='';
                }
                if(this.loading!=null&&this.loading!=''&&this.loading!=this.current){
                    this.set();
                }
            },250);
        },250);
    },
    resources:{},
    loadingsvg:
    '<svg class="loadingspinner" viewBox="0 0 538 438">'+
        '<path d="M281 62C300 62 317 79 317 98C317 117 300 134 281 134C261 134 245 117 245 98C245 79 261 62 281 62Z"/>'+
        '<path d="M367 97C386 97 403 114 403 133C403 153 386 170 367 170C347 170 331 153 331 133C331 114 347 97 367 97Z"/>'+
        '<path d="M402 183C422 183 438 200 438 219C438 239 422 255 402 255C383 255 367 239 367 219C367 200 383 183 402 183Z"/>'+
        '<path d="M367 269C386 269 403 285 403 305C403 324 386 341 367 341C347 341 331 324 331 305C331 285 347 269 367 269Z"/>'+
        '<path d="M281 304C300 304 317 321 317 340C317 360 300 376 281 376C261 376 245 360 245 340C245 321 261 304 281 304Z"/>'+
        '<path d="M194 269C214 269 230 285 230 305C230 324 214 341 194 341C175 341 159 324 159 305C159 285 175 269 194 269Z"/>'+
        '<path d="M159 183C178 183 195 200 195 219C195 239 178 255 159 255C139 255 123 239 123 219C123 200 139 183 159 183Z"/>'+
        '<path d="M194 98C214 98 231 114 231 133C231 153 214 169 194 169C175 169 158 153 158 133C158 114 175 98 194 98Z"/>'+
    '</svg>'
};
function innertextvalue(text){
    if(!text instanceof String&&typeof text!='string')return '';
    return text.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
pagebody.set('home');