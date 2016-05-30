
exports.RTvideo_get=function(data,ws){

	var res="false";
	try{
		if (data.key){
			var file="/tmp/"+data.key;
			if (data.server_side_encode){
				var images = require("images");
				var width=data.width || 360;
				var height=data.height || 240;
				var format=data.format || "jpg";
				var opt=data.opt || "75";
				res=images(file).resize(width,height).encode(format, {operation:opt});
			}else{
				var rf=require("fs");
				res=rf.readFileSync(file);
			}
	
		}
	}catch(e){};
	return res;
}
