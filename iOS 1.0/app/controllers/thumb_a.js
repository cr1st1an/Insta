$.thumb_a.updateData = function(dataParam){
	$.photo.image = dataParam['images']['low_resolution']['url'];
	$.profile_picture.image = dataParam['user']['profile_picture'];
	$.username.text = dataParam['user']['username'];
	$.time.text = dataParam['time_ago'];
	
	if(dataParam['user_has_liked']){
		$.heart.image = '/main/heart_true.png';
	} else {
		$.heart.image = '/main/heart_false.png';
	}
}