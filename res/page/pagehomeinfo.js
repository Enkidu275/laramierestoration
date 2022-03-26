var pagehomeinfo={
    title:'',
    html:'',
    active:false,
    url:'',
    update:function(){},
    open:async function(url){
        this.active=true;
        if(url instanceof String ||typeof url=='string')this.url=url;
        loader.data.post('/home/'+url,{});
    },
    close:function(){
        this.active=false;
    }
};
pagebody.resources.homeinfo={
    html:function(){pagehomeinfo.update();return pagehomeinfo.html;},
    title:function(){return pagehomeinfo.title;},
    open:function(data){pagehomeinfo.open(data);},
    close:function(){pagehomeinfo.close();}
};
pagebody.set();