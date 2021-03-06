/*
实时视频类
<canvas id="videocvs" class=""></canvas>
var video=new RTvideo({
	server:"ws://172.0.8.5:8080",
	width:320,
	height:240,
	key:"somewhere/name.jpg",
	id:"videocvs"   //canvas id 可以通过id自适应img或者canvas
});
video.start();
video.stop();
*/

function RTvideo(opt){
	this.opt=$.extend({//这里写默认配置
		server:"ws://172.0.8.5:8080",
		key:"",
		id:"",
		
		width:320,
		height:240,
		format:'jpg',
		
		stylewidth:"320px",
		styleheight:"240px",
		
		FPS:10,

		server_side_encode:false,
		opt:75,
		
		autostart:false,
		
	
	},opt);
	
	
	var that=this;
	this.canvas;
	this.ctx;
	this.ws=new WSocket(this.opt.server,'none');
	this.ws.ondata(function(data,evt){that.draw(data,evt);});
	this.ws.onerror=function(evt){that.error(evt);};
	this.isstart=false;
	this.lasttime;
	this.timebtw;
	this.timer;
	this.image;
	
	
	this.createObjectURL=window[window.URL ? 'URL' : 'webkitURL']['createObjectURL'];
	this.revokeObjectURL=window[window.URL ? 'URL' : 'webkitURL']['revokeObjectURL'];
	
	this.FPS();
	if (this.opt.id) this.bind(this.opt.id);
	
	this.sendopt={
		act:"RTvideo_get",
		key:this.opt.key	
	}
	if (this.opt.server_side_encode){
		this.sendopt.width=this.opt.width;
		this.sendopt.height=this.opt.height;
		this.sendopt.format=this.opt.format;
		this.sendopt.server_side_encode=this.opt.server_side_encode;
		this.sendopt.opt=this.opt.opt;
	}
	
	if (this.opt.autostart){
		this.ws.open(function(){that.start();});
		
	}else{
		this.ws.open();
	}
}
RTvideo.prototype.bind=function(id){
	
	var that=this;
	var obj=document.getElementById(id);
	this.opt.bindtype=obj.tagName;
	if (this.opt.bindtype=="IMG"){
		this.image =obj;
		this.image.width=this.opt.width;
		this.image.height=this.opt.height;
		this.image.style.width = this.opt.stylewidth;
		this.image.style.height = this.opt.styleheight;
		this.image.onload = function(e) {
				that.revokeObjectURL(that.image.src); // 清除释放
			};
	}else if (this.opt.bindtype=="CANVAS"){
	
		this.image = new Image();

		this.image.onload = function(e) {
				that.canvas.width=that.image.width;
				that.canvas.height=that.image.height;
				that.ctx.drawImage(that.image,0,0);
				that.revokeObjectURL(that.image.src); // 清除释放
			};
		this.canvas=obj;
		this.ctx=this.canvas.getContext('2d');
		this.canvas.width=this.opt.width;
		this.canvas.height=this.opt.height;
		this.canvas.style.width = this.opt.stylewidth;
		this.canvas.style.height = this.opt.styleheight;
		
	}else{
		console.log("We need <img> or <canvas>");
	}
	
}
RTvideo.prototype.start=function(){
	if (!this.isstart){
		var that=this;
		this.isstart=true;
		this.timer=setInterval(function(){that.check();},2000);
		this.getframe();
	}
	
}
RTvideo.prototype.error=function(evt){
	//console.log('error');
	//console.log(this);
	//console.log(evt);
}
RTvideo.prototype.stop=function(){
	this.isstart=false;
	clearInterval(this.timer);
	
}
RTvideo.prototype.FPS=function(fps){
	this.opt.FPS=parseInt(fps) || this.opt.FPS;
	this.timebtw=1000/this.opt.FPS;
	
}
RTvideo.prototype.getframe=function(){
	if (!this.isstart) return;
	this.lasttime=new Date().getTime();
	
	this.ws.send(this.sendopt);

}
RTvideo.prototype.check=function(){

	var now=new Date().getTime();
	var passtime=now-this.lasttime;
	if ((now-this.lasttime)>3500) this.getframe();

}
RTvideo.prototype.draw=function(data,evt){
	var that=this;

	var now=new Date().getTime();
	var passtime=now-that.lasttime;
	var runtime=that.timebtw-(now-that.lasttime);
	if (runtime<1) runtime=1;

	setTimeout(function(){

		that.getframe();
	
		},runtime);

	if (typeof(data)=='object'){
		
		that.image.src = that.createObjectURL(data);
	}

}
