var index = 0;
var header_height = 0;
var thumb_height = 0;

$.main.addEventListener('dragEnd', function(e) {
	var contentHeight = Math.floor(((index * thumb_height) / Ti.Platform.displayCaps.platformWidth) * thumb_height);
	var currentBottom = $.main.contentOffset.y + Ti.Platform.displayCaps.platformHeight;
	var threshold = (Ti.Platform.displayCaps.platformHeight * 4);
	
	Ti.API.info('(currentBottom + threshold): '+(currentBottom + threshold));
	Ti.API.info('contentHeight: '+contentHeight);
	
	if ((currentBottom + threshold) > contentHeight) {
		Ti.App.fireEvent('navigation', {
			action : 'load_more'
		});
	}

});

$.main.increaseIndex = function(countParam){
	index += countParam;
}

$.main.scrollToIndex = function(indexParam) {
	var columns = 0;
	if (Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
		columns = 3;
	} else {
		columns = 4;
	}

	$.main.offset_y = (Math.floor(indexParam / columns) * thumb_height) + header_height;

	if ($.main.offset_y > ($.main.contentHeight - Ti.Platform.displayCaps.platformHeight))
		$.main.offset_y = ($.main.contentHeight - Ti.Platform.displayCaps.platformHeight);

	if ($.main.offset_y < 0)
		$.main.offset_y = 0;

	$.main.setContentOffset({
		y : $.main.offset_y
	});
	
	$.main.fireEvent('dragEnd');
}

$.main.refreshContainer = function() {
	index = 0;
	
	if (null !== $.main.header)
		header_height = $.main.header.toImage().height;
	else
		header_height = 0;
		
	if (null !== $.main.container)
		thumb_height = $.main.container.getThumbHeight();
	else
		thumb_height = 0;
}
