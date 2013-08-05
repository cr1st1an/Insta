var buffers = [];
var current_buffer = 0;
var buffer_index;
var item_count = 0;
var thumbs = [];
var thumbLayout = null;
var open = true;

newBuffer();

$.container.setThumbLayout = function(thumbLayoutParam) {
	$.container.thumbLayout = thumbLayoutParam;
}

$.container.getThumbHeight = function() {
	var temp_height = 0;
	var temp_thumb = Alloy.createController($.container.thumbLayout).getView();
	temp_height = temp_thumb.height;
	temp_thumb = null;
	return temp_height;
}

$.container.appendData = function(dataParam, endParam) {
	if (open) {
		for (var i in dataParam) {
			thumbs[i] = Alloy.createController($.container.thumbLayout).getView();
			thumbs[i].updateData(dataParam[i]);
			buffers[current_buffer].add(thumbs[i]);
			buffers[current_buffer].items++;

			buffer_index++;
			item_count++;

			if (12 === buffer_index) {
				$.container.add(buffers[current_buffer++]);
				newBuffer();
			}
		}

		if (endParam) {
			open = false;
			$.container.add(buffers[current_buffer++]);
		}

		$.container.fireEvent('orientationChange');
	}
};

function newBuffer() {
	buffers[current_buffer] = Ti.UI.createView({
		width : Ti.Platform.displayCaps.platformWidth,
		top : 0,
		height : 1232,
		layout : 'horizontal',
		items : 0
	});
	buffer_index = 0;
};

$.container.addEventListener('orientationChange', function(e) {
	if (undefined !== thumbs[0]) {
		var columns = 0;
		if (Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
			columns = 3;
		} else {
			columns = 4;
		}

		if (Ti.Platform.displayCaps.platformWidth !== $.container.width)
			$.container.width = Ti.Platform.displayCaps.platformWidth;
		if ((Math.ceil(item_count / columns) * thumbs[0].height) !== $.container.height)
			$.container.height = (Math.ceil(item_count / columns) * thumbs[0].height);

		for (var i in buffers) {
			if (Ti.Platform.displayCaps.platformWidth !== buffers[i].width)
				buffers[i].width = Ti.Platform.displayCaps.platformWidth;
			if ((Math.ceil(buffers[i].items / columns) * thumbs[0].height) !== buffers[i].height)
				buffers[i].height = (Math.ceil(buffers[i].items / columns) * thumbs[0].height);
		}
	}

});

$.container.addEventListener('click', function(e) {
	if (undefined !== e.source.id) {
		Ti.App.fireEvent('ui', {
			action : 'slideshow_open_slideshow',
			id : e.source.id
		});
	}
});
