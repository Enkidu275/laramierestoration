var pagehomelist={
    html:'',
    active:false,
    title:'Public Listings',
    list:null,//while null, makes loading message, else populates by list values.
    arrowleft:
    '<svg viewBox="0 0 10 10" class="arrowleft">'+
        '<path d="M2 5L8 0L8 0L8 0L8 10L8 10L8 10Z"/>'+
    '</svg>',
    arrowright:
    '<svg viewBox="0 0 10 10" class="arrowright">'+
        '<path d="M8 5L2 0L2 0L2 0L2 10L2 10L2 10Z"/>'+
    '</svg>',
    update:function(){
        var newhtml=
        '<h1 class="title">Public Listings</h1>'+
        '<div class="paragraph">'+
            'To proceed, choose filter parameters, and search through houses. '+
            'Appointments can be booked by selecting a home. (MST Timezone)'+
        '</div>';
        if(this.list==null){
            //Search loading
            newhtml+=pagebody.loadingsvg;
        } else if(this.list.length==0){
            //Search unsuccessful, no matches
            newhtml+=
            '<div class="paragraph error">'+
                'No Results Found, Try Changing Your Search Criteria'+
            '</div>';
        } else {
            //Search successful, show list
            var i=0;
            var j=0;
            var newlistitem='';
            while(i<this.list.length){
                var title=innertextvalue(this.list[i].title);
                var description=innertextvalue(this.list[i].description);
                if(title!=''&&description!=''&&this.list[i].images instanceof Array){
                    //image is the starting index of the visible image
                    newlistitem='<div id="houselist'+i+'" class="houselistitem'+(this.list[i].active===null?'':this.list[i].active?' next':' previous')+'">';
                    newlistitem=newlistitem+'<h1>'+title+'</h1><h2>'+description+'</h2><div>';
                    if(isNaN(this.list[i].image)){
                        this.list[i].image=0;
                    }
                    var j=this.list[i].image;
                    if(j==null)j=0;
                    if(j<this.list[i].images.length){
                        //Add First 3 Images
                        newlistitem=newlistitem+'<div id="houselist'+i+'_0">';
                        if(this.list[i].images[j] instanceof String||typeof this.list[i].images[j]=='string'){
                            newlistitem=newlistitem+'<img onerror="this.style.display=\'none\'" src="/image/'+this.list[i].images[j]+'"/>'
                        }
                        newlistitem=newlistitem+'</div><div id="houselist'+i+'_1">';
                        if(this.list[i].images[j+1] instanceof String||typeof this.list[i].images[j+1]=='string'){
                            newlistitem=newlistitem+'<img onerror="this.style.display=\'none\'" src="/image/'+this.list[i].images[j+1]+'"/>'
                        }
                        newlistitem=newlistitem+'</div><div id="houselist'+i+'_2">';
                        if(this.list[i].images[j+2] instanceof String||typeof this.list[i].images[j+2]=='string'){
                            newlistitem=newlistitem+'<img onerror="this.style.display=\'none\'" src="/image/'+this.list[i].images[j+2]+'"/>'
                        }
                        newlistitem+='</div>';
                        //Add Shadow Image
                        newlistitem+='<br/><div id="houselistshadow'+i+'">';
                        if(this.list[i].active===true&&this.list[i].images[j+3]!=null){
                            newlistitem=newlistitem+'<img onerror="this.style.display=\'none\'" src="/image/'+this.list[i].images[j+3]+'"/>'
                        }
                        if(this.list[i].active===false&&this.list[i].images[j-1]!=null){
                            newlistitem=newlistitem+'<img onerror="this.style.display=\'none\'" src="/image/'+this.list[i].images[j-1]+'"/>'
                        }
                        newlistitem+='</div>';
                        //Add Arrows
                        newlistitem=newlistitem+
                        '<br/><svg id="houselistprevious'+i+'" onclick="pagehomelist.cycle('+i+',false)" viewBox="0 0 10 10" class="arrowleft'+((this.list[i].image==0)?' disabled':'')+'">'+
                            '<path d="M2 5L8 0L8 0L8 0L8 10L8 10L8 10Z"/>'+
                        '</svg><svg id="houselistnext'+i+'" onclick="pagehomelist.cycle('+i+',true)" viewBox="0 0 10 10" class="arrowright'+((this.list[i].image+3>=this.list[i].images.length)?' disabled':'')+'">'+
                            '<path d="M8 5L2 0L2 0L2 0L2 10L2 10L2 10Z"/>'+
                        '</svg>';
                    }
                    newlistitem+='</div></div>';
                    newhtml+=newlistitem;
                }
                i++;
            }
        }
        this.html=newhtml;
    },
    cycle:function(i,next){
        if(this.list[i]==null)return;
        if(isNaN(this.list[i].image))this.list[i].image=0;
        if(next&&this.list[i].image+3>=this.list[i].images.length)return;
        if(!next&&this.list[i].image==0)return;
        if(this.list[i].active!==null)return;
        var shadowimage;
        if(next) shadowimage=this.list[i].images[this.list[i].image+3]; else this.list[i].images[this.list[i].image-1];
        if(!shadowimage instanceof String&&typeof shadowimage!='string')return;
        if(!shadowimage instanceof String&&typeof shadowimage!='string')return;
        var shadowelement=document.getElementById('houselistshadow'+i);
        var houselistitem=document.getElementById('houselist'+i);
        var houselistprevious=document.getElementById('houselistprevious'+i);
        var houselistnext=document.getElementById('houselistnext'+i);
        if(shadowelement==null||houselistitem==null||houselistprevious==null||houselistprevious==null)return;
        shadowelement.innerHTML='<img onerror="this.style.display=\'none\'" src="/image/'+shadowimage+'"/>';
        if(next) houselistitem.classList='houselistitem next'; else houselistitem.classList='houselistitem previous';
        houselistprevious.classList='arrowleft disabled';
        houselistnext.classList='arrowright disabled';
        this.list[i].active=true;
        if(next) this.list[i].image++; else this.list[i].image--;
        setTimeout(()=>{this.endcycle(i)},200);
    },
    endcycle:function(i){
        var shadowelement=document.getElementById('houselistshadow'+i);
        var houselistitem=document.getElementById('houselist'+i);
        var houselistprevious=document.getElementById('houselistprevious'+i);
        var houselistnext=document.getElementById('houselistnext'+i);
        var houselist0=document.getElementById('houselist'+i+'_0');
        var houselist1=document.getElementById('houselist'+i+'_1');
        var houselist2=document.getElementById('houselist'+i+'_2');
        var image0=this.list[i].images[this.list[i].image];
        var image1=this.list[i].images[this.list[i].image+1];
        var image2=this.list[i].images[this.list[i].image+2];
        if(shadowelement==null||houselistitem==null||houselistprevious==null||houselistprevious==null||houselist0==null||houselist1==null||houselist2==null)return;
        shadowelement.innerHTML='';
        if(image0 instanceof String||typeof image0=='string'){
            houselist0.innerHTML='<img onerror="this.style.display=\'none\'" src="/image/'+image0+'"/>';
        } else {
            houselist0.innerHTML='';
        }
        if(image1 instanceof String||typeof image1=='string'){
            houselist1.innerHTML='<img onerror="this.style.display=\'none\'" src="/image/'+image1+'"/>';
        } else {
            houselist1.innerHTML='';
        }
        if(image2 instanceof String||typeof image2=='string'){
            houselist2.innerHTML='<img onerror="this.style.display=\'none\'" src="/image/'+image2+'"/>';
        } else {
            houselist2.innerHTML='';
        }
        houselistitem.classList='houselistitem';
        if(this.list[i].image==0)houselistprevious.classlist='arrowleft disabled'; else houselistprevious.classList='arrowleft';
        if(this.list[i].image+3>=this.list[i].images.length)houselistnext.classlist='arrowright disabled'; else houselistnext.classList='arrowright';
        this.list[i].active=null;
    },
    select:function(i){
        menubar.set('pagehome');
    },
    open:function(){this.active=true;},
    close:function(){this.active=false;},
    filter:function(){//resends search by filter criteria

    }
};
pagehomelist.list=[{active:null,title:'A House, Fuck You',description:'2 Bedrooms, Fuck You',images:['afde','toasterchan.jpg','ades','toasterchan.jpg','asdfer']},{active:null,title:'A House, Fuck You',description:'2 Bedrooms, Please accept the invitation, I love you',images:['afde','ades']}];
pagebody.resources.homelist={
    html:function(){pagehomelist.update();return pagehomelist.html;},
    title:function(){return pagehomelist.title;},
    open:function(){pagehomelist.open();},
    close:function(){pagehomelist.close();}
}
pagebody.set();