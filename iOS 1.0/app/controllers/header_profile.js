Ti.App.fireEvent('navigation', {
	action : 'request_user_data'
});

$.header_profile.appendData = function(dataParam){
	$.profile_picture.image = dataParam['profile_picture'];
	$.full_name.text = dataParam['full_name'];
	$.bio.text = dataParam['bio'];
	$.website.text = dataParam['website'];
	$.photos.text = dataParam['counts']['media'];
	$.following.text = dataParam['counts']['follows'];
	$.followers.text = dataParam['counts']['followed_by'];
}

$.header_profile.addEventListener('orientationChange', function(e) {
	$.header_profile.width = Ti.Platform.displayCaps.platformWidth;
});

function logoutTap(){
	Ti.App.fireEvent('navigation', {
		action : 'logout'
	});
}
