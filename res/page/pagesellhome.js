var pagesellhome={
    html:'',
    title:'Sell Home',
    active:false,
    update:function(){
        this.html=
        '<h1 class="title">Sell Home</h1>'+
        '<div class="paragraph"></div>';
    },
    open:function(){this.active=true;},
    close:function(){this.active=false;}
};
pagebody.resources.sellhome={
    html:function(){pagesellhome.update();return pagesellhome.html;},
    title:function(){return pagesellhome.title;},
    open:function(){pagesellhome.open();},
    close:function(){pagesellhome.close();}
};
pagebody.set();