$.thumb_a.updateData = function(dataParam){
	$.thumb_a.id = dataParam['id'];
	$.photo.image = dataParam['images']['low_resolution']['url'];
	$.profile_picture.image = dataParam['user']['profile_picture'];
	$.username.text = dataParam['user']['username'];
	$.time.text = Alloy.Globals.util.timeAgo(dataParam['created_time'])+' ago';
	
	if(dataParam['user_has_liked']){
		$.heart.image = '/main/heart_true.png';
	} else {
		$.heart.image = '/main/heart_false.png';
	}
}