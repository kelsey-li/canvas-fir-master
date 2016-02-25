window.onload = function () {
	var 
  reset=document.querySelector('.reset'),
  canvas = document.querySelector('#canvas'),
  canvas1 = document.querySelector('#canvas1'),
  ctx = canvas.getContext('2d'),
  ctx1 = canvas1.getContext('2d'),
  //棋盘大小
  ROW = 15,
  //棋盘星点位置数据
  z = [140.5,460.5],
  //所有的落子数据
  qizi = {},
  //标示该谁落子
  kaiguan = localStorage.x?false:true;
  var huaqipan = function() {
    ctx.clearRect(0,0,600,600);
    for(var i = 0; i < ROW; i++){
      var li = ctx.createLinearGradient(0,0,560,0);
      li.addColorStop(0.5,'#000');
      li.addColorStop(1,'black');
      ctx.strokeStyle = li;
      ctx.beginPath();
      ctx.moveTo(20,i*40 + 20.5);
      ctx.lineTo(580,i*40 + 20.5);
      ctx.stroke();

      var li = ctx.createLinearGradient(0,0,0,560);
      li.addColorStop(0.5,'#000');
      li.addColorStop(1,'#000');
      ctx.strokeStyle = li;
      ctx.beginPath();
      ctx.moveTo(i*40+20.5,20);
      ctx.lineTo(i*40+20.5,580);
      ctx.stroke();
    }
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(300.5,300.5,3,0,Math.PI*2);
    ctx.fill();
    for(var i = 0; i < z.length; i++){
      for(var j = 0; j < z.length; j++){
        ctx.beginPath();
        ctx.arc(z[i],z[j],3,0,Math.PI*2);
        ctx.fill(); 
      }
    }
  }
  huaqipan();

  /*
  *  x    number   落子x坐标
  *  y    number   落子y坐标
  *  color boolean  true代表黑子  false代表白子 
  */
  var luozi = function (x,y,color) {  
    var zx = 40*x + 20.5;
    var zy = 40*y + 20.5;
    var black = ctx1.createRadialGradient(zx-5,zy-5,1,zx,zy,18);
    black.addColorStop(0.2,'#555');
    black.addColorStop(1,'black'); 
    var white = ctx1.createRadialGradient(zx-5,zy-5,1,zx,zy,18);
    white.addColorStop(0.2,'#fff');
    white.addColorStop(1,'#ddd');
    ctx1.fillStyle= color?black:white;
    ctx1.beginPath();
    ctx1.arc(zx,zy,18,0,Math.PI*2);
    ctx1.fill();
  }
  // var qiziimg = document.querySelector('#sucai');
  // var luozi = function(x,y,color) {
  //   var zx = 40*x + 2.5;
  //   var zy = 40*y + 2.5;
  //   if(color){
  //     ctx1.drawImage(qiziimg,0,0,42,44,zx,zy,36,36);
  //   }else{
  //     ctx1.drawImage(qiziimg,43,0,42,44,zx,zy,36,36);
  //   }
  // }

  canvas1.onclick = function (e) {
    var zx = 40*x + 20.5;
    var zy = 40*y + 20.5;
    var x =  Math.round( (e.offsetX-20.5)/40 ); 
    var y =  Math.round( (e.offsetY-20.5)/40 ); 
    if( qizi[x+'-'+y] ){return;}
    luozi(x,y,kaiguan);
    qizi[x + '-'+ y] = kaiguan?'black':'white';

    if(kaiguan){
      if( panduan(x,y,'black') ){
        alert('黑棋赢');
        if(confirm('再来一局')){
          localStorage.clear();
          location.reload();
          huaqipan();
          kaiguan = true;
          return;
        }else{
          canvas1.onclick  = null;
        }
      }
    }else{
      if( panduan(x,y,'white') ){
        alert('白棋赢');
        if(confirm('再来一局')){
          location.reload();
          localStorage.clear();
          huaqipan();
          kaiguan = true;
          return;
        }else{
          canvas1.onclick = null;
        }
      }
    }
    kaiguan = !kaiguan;
    localStorage.data = JSON.stringify(qizi);
    if(!kaiguan){
      localStorage.x = 1;
    }else{
      localStorage.removeItem('x');
    }
} 

  var reset1 = document.querySelector('.reset1');
  reset1.onclick = function(){
        var r=[];
        var w=[];
        data=JSON.parse(localStorage.data);
        if(JSON.stringify(data)==0){
          reset1.onclick=null;
          return;
        }
        for(var i in data){
          r.push(i);
          w.push(data[i]);
        }
        r.pop();
        w.pop();
        for(var i=0;i<r.length;i++){
          var x=r[i].split('-')[0];
          var y=r[i].split('-')[1];
          luozi(x,y,(w[i]=='black')?true:false);
          if((w[i]=='black')?true:false){
            localStorage.x=1;
          }
          else{
            localStorage.removeItem('x');
          }
        }
        data={};
        for(var i=0;i<w.length;i++){
          var x=r[i].split('-')[0];
          var y=r[i].split('-')[1];
          data[x+'-'+y]=w[i];
        
        if((w[i]=='black')?true:false){
          localStorage.x=1;
        }
        else{
          localStorage.removeItem('x');
        }
      }
        localStorage.data=JSON.stringify(data);
        location.reload();
      } 

  var xy2id = function(x,y) {
    return x + '-' + y;
  }
  var panduan = function(x,y,color) {
    var shuju = filter(color);
    var tx,ty,hang = 1;shu = 1; zuoxie= 1;youxie = 1;
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty ) ]){tx--;hang++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty ) ]){tx++;hang++};
    if(hang >= 5){return true};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
    if(shu >= 5){return true};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
    if(zuoxie >= 5){return true};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
    if(youxie >= 5){return true};
  }
  var filter = function(color) {
    var r = {};
    for(var i in qizi){
      if(qizi[i]  == color){
        r[i] = qizi[i];
      }
    }
    return r;
  }

  /*如果本地存储中有棋盘数据,读取这些数据并绘制到页面中*/
  if(localStorage.data){
    qizi =  JSON.parse(localStorage.data);
    for(var i in qizi){
      var x = i.split('-')[0];
      var y = i.split('-')[1];
      luozi(x,y, (qizi[i]=='black')?true:false );
    }
  }

  canvas.ondblclick = function (e) {
    e.stopPropagation();
  }
  reset.onclick = function () {
    localStorage.clear();
    location.reload();
  }

}