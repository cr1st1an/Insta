$.slide.updateData = function(dataParam) {
	$.photo.backgroundImage = dataParam['images']['low_resolution']['url'];
	$.photo.image = dataParam['images']['standard_resolution']['url'];
	
	$.profile_picture.image = dataParam['user']['profile_picture'];
	$.username.text = dataParam['user']['username'];
	if(null !== dataParam['caption'])
		$.caption.text = dataParam['caption']['text'];
	$.time.text = Alloy.Globals.util.timeAgo(dataParam['created_time']);
	
	$.slide.top = Math.floor((Ti.Platform.displayCaps.platformHeight - 20 - $.slide.toImage().height) / 2);
	if(0 > $.slide.top)
		$.slide.top = 0;
}

function heartSwitch(IsLikedParam) {
	switch(IsLikedParam) {
		case true:
		$.like.backgroundImage = $.like.backgroundSelectedImage;
			break;
		case false:
		$.like.backgroundImage = $.like.backgroundBaseImage;
			break;
	}
}