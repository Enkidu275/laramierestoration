var pagehome={
    html:'',
    active:false,
    title:'Looking for your new home?',
    update:function(){
        this.html=
        '<h1 class="title">Looking for your new home?</h1>'+
        '<div class="paragraph">'+
            'Here in Laramie, we pride ourselves on our efficiency. Looking to work remote and live on a dime? '+
            'This is a reasonable way to accomplish that. '+
            'Laramie Restoration takes dilapidated and damaged structures, and transforms them into habitable enclosures.'+
        '</div>'+
        '<div class="paragraph">'+
            'Ready to get started? Book an appointment with one of our office animals. '+
            'Its name is Michael and it likes alfalfa, but also accepts souls and bitcoin as legal tender.'+
        '</div>'+
        '<p onclick="pagebody.set(\'homelist\')" class="routelink">Find A Home</p>';
    },
    open:function(){
        this.active=true;
    },
    close:function(){
        this.active=false;
    }
}
pagebody.resources.home={
    html:function(){pagehome.update();return pagehome.html;},
    title:function(){return pagehome.title;},
    open:function(){pagehome.open();},
    close:function(){pagehome.close();}
}
pagebody.set();