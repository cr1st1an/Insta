$.main.addEventListener('dragEnd', function(e) {
	var contentHeight = Math.floor((($.main.index * 256) / Ti.Platform.displayCaps.platformWidth) * 256);
	var currentBottom = $.main.contentOffset.y + Ti.Platform.displayCaps.platformHeight;
	var threshold =  Ti.Platform.displayCaps.platformHeight * 2;
	
	if ((currentBottom + threshold) > contentHeight){
		Ti.App.fireEvent('navigation', {
			action : 'load_more'
		});
	}

});