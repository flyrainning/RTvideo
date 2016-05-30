# RTvideo
实时图片显示，基于nodejs



基于WSocket https://github.com/flyrainning/WSocket 制作的实时视频显示。

可以将服务器中的jpg图片实时显示在网页中，支持FPS调节。


```
<canvas id="videocvs" class=""></canvas>

<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="WSocket.js"></script>
<script type="text/javascript" src="RTvideo.js"></script>
<script type="text/javascript">


var video=new RTvideo({
	server:"ws://127.0.0.1:8080",
	width:320,
	height:240,
	key:"1.jpg",
	id:"videocvs",   //canvas id
	autostart:true,
	server_side_encode:false  //开启会在服务器端缩放压缩图片，节省带宽，但消耗服务器资源
});

//video.start();
//video.stop();
//video.FPS(10);
</script>


```
