 function whoisdog(numid){
  // var numid = Number(numids)
    console.log("user numid:",numid)
    if(numid==1){
       return 'you are a dog' ;
    }else if(numid==2){
        return 'you are a duck' ;
    }else if(numid==3){
        return 'you are a child' ;
    }else if(numid==4){
        return 'you are a car' ;
    }else{
        return 'you are a monkey' ;
    }
}

function whoisdog2(numid){
    var whostr = 'you are a monkey';
    if(numid==1){
        whostr = 'you are a dog' ;
    }else if(numid==2){
        whostr =  'you are a duck' ;
    }else if(numid==3){
        whostr =  'you are a child' ;
    }else if(numid==4){
        whostr =  'you are a car' ;
    }else{
        whostr =  'you are a monkey' ;
    }
    console.log("whostr:",whostr)
    return whostr;
}
