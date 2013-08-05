$.thumb_b.updateData = function(dataParam){
	$.thumb_b.id = dataParam['id'];
	$.photo.image = dataParam['images']['low_resolution']['url'];
}