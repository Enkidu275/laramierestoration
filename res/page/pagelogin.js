var pagelogin={
    html:'',
    title:'Login',
    active:false,
    user:'',
    password:'',
    update:function(){
        var user=this.user;
        var password=this.password;
        var loginuserelement=document.getElementById('loginuser');
        var loginpasswordelement=document.getElementById('loginpassword');
        if(loginuserelement)user=loginuserelement.value;
        if(loginpasswordelement)password=loginpasswordelement.value;
        user=innertextvalue(user);
        password=innertextvalue(password);
        this.html=
        '<h1 class="title">Login</h1>'+
        '<div class="paragraph">'+
            'Unauthorized Access Forbidden'+
        '</div>'+
        '<input value="'+user+'" class="input" id="loginuser" placeholder="Username"/><br/>'+
        '<input value="'+password+'" class="input" type="password" id="loginpassword" placeholder="Password"/>'+
        '<p onclick="pagelogin.login()" class="routelink">Login</p>'+
        '<p onclick="pagebody.set(\'home\')" class="routelink">Back</p>';
    },
    login:function(){},
    open:function(){this.active=true},
    close:function(){this.active=false;}
};
pagebody.resources.login={
    html:function(){pagelogin.update();return pagelogin.html;},
    title:function(){return pagelogin.title;},
    open:function(){pagelogin.open();},
    close:function(){pagelogin.close();}
};
pagebody.set();